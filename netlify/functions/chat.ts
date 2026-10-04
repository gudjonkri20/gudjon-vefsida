import Anthropic from '@anthropic-ai/sdk';
import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { buildSystemPrompt } from './_chatContext';

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: IncomingMessage[];
  language?: 'en' | 'is';
}

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;
const MAX_MESSAGES = 30;
const MAX_USER_CHARS = 2000;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Hard ceiling across every caller, per UTC day. The per-IP limit alone does
// not bound spend: a distributed caller simply brings more IPs. This is the
// number that decides the worst case, so keep it small enough that a bad day
// is survivable. 500 x 800 output tokens on Haiku is cents, not rent.
const DAILY_CAP = 500;

const store = () => getStore({ name: 'chat-limits', consistency: 'strong' });

/** Never store a raw IP; the hash is only ever compared against itself. */
const hashIp = async (ip: string): Promise<string> => {
  const salt = process.env.RATE_LIMIT_SALT ?? 'gk-chat';
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const utcDay = (): string => new Date().toISOString().slice(0, 10);

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Shared counters in Netlify Blobs, so the limit survives the function
 * scaling out — the previous in-process Map reset to empty on every new
 * instance, which made the limit close to unenforceable under real load.
 *
 * Read-modify-write is not atomic here. Two simultaneous requests can both
 * read the same count and each write back count+1, losing one increment.
 * That is acceptable for a budget guard: the error is bounded by concurrency
 * and always undercounts slightly, never locks anyone out incorrectly.
 */
const checkLimits = async (
  ip: string,
): Promise<'ok' | 'rate_limited' | 'daily_cap'> => {
  const s = store();
  const now = Date.now();

  const dayKey = `day:${utcDay()}`;
  const day = ((await s.get(dayKey, { type: 'json' })) as { count: number } | null) ?? {
    count: 0,
  };
  if (day.count >= DAILY_CAP) return 'daily_cap';

  const ipKey = `ip:${await hashIp(ip)}`;
  const bucket = (await s.get(ipKey, { type: 'json' })) as Bucket | null;

  if (!bucket || bucket.resetAt < now) {
    await s.setJSON(ipKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    if (bucket.count >= RATE_LIMIT) return 'rate_limited';
    await s.setJSON(ipKey, { count: bucket.count + 1, resetAt: bucket.resetAt });
  }

  await s.setJSON(dayKey, { count: day.count + 1 });
  return 'ok';
};

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

// The widget is same-origin, so no third party has a reason to preflight
// this endpoint. Echoing back "*" invited any page on the web to spend the
// API budget. Deploy previews are matched so the chat still works there.
const originAllowed = (origin: string | null): boolean => {
  if (!origin) return false;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:' && hostname !== 'localhost') return false;
    return (
      hostname === 'gudjonkristjansson.com' ||
      hostname === 'www.gudjonkristjansson.com' ||
      hostname.endsWith('.netlify.app') ||
      hostname === 'localhost'
    );
  } catch {
    return false;
  }
};

export default async (req: Request, context: Context): Promise<Response> => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    if (!originAllowed(origin)) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin as string,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        vary: 'origin',
      },
    });
  }

  // A cross-origin POST from a browser must have passed the preflight above;
  // this rejects the ones that carry a foreign Origin anyway. Non-browser
  // clients send no Origin at all and are governed by the limits below.
  if (origin && !originAllowed(origin)) {
    return json(403, { error: 'forbidden_origin' });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(503, {
      error: 'offline',
      message:
        "AI is offline right now. Email gudjonk6@gmail.com directly and Guðjón will get back to you.",
    });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return json(400, { error: 'no_messages' });
  }
  if (body.messages.length > MAX_MESSAGES) {
    return json(400, { error: 'too_many_messages' });
  }
  for (const m of body.messages) {
    if (!['user', 'assistant'].includes(m.role) || typeof m.content !== 'string') {
      return json(400, { error: 'malformed_message' });
    }
    if (m.content.length > MAX_USER_CHARS) {
      return json(400, { error: 'message_too_long' });
    }
  }
  if (body.messages[body.messages.length - 1].role !== 'user') {
    return json(400, { error: 'last_message_must_be_user' });
  }

  const ip =
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    context.ip ??
    'unknown';

  // Fail closed. If the shared counter is unreachable we cannot bound spend,
  // and an unbounded spend bug is what takes a site offline; a temporarily
  // unavailable chat widget is not.
  let verdict: 'ok' | 'rate_limited' | 'daily_cap';
  try {
    verdict = await checkLimits(ip);
  } catch (err) {
    console.error('Rate limit store unavailable:', err);
    return json(503, {
      error: 'offline',
      message:
        'AI is briefly unavailable. Email gudjonk6@gmail.com directly and Guðjón will get back to you.',
    });
  }

  if (verdict === 'daily_cap') {
    return json(429, {
      error: 'daily_cap',
      message:
        "The assistant has hit its daily limit. Email gudjonk6@gmail.com directly and Guðjón will get back to you.",
    });
  }
  if (verdict === 'rate_limited') {
    return json(429, {
      error: 'rate_limited',
      message:
        "You've hit the rate limit for this hour. Please come back later or email gudjonk6@gmail.com directly.",
    });
  }

  const language = body.language === 'is' ? 'is' : 'en';
  const systemPrompt = buildSystemPrompt({ language });

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: body.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return json(200, {
      reply: text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    console.error('Anthropic API error:', message);
    return json(502, {
      error: 'upstream_error',
      message:
        'Something went wrong on the AI side. Try again, or email gudjonk6@gmail.com directly.',
    });
  }
};

export const config = {
  path: '/api/chat',
};
