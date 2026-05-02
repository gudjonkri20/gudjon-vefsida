import Anthropic from '@anthropic-ai/sdk';
import type { Context } from '@netlify/functions';
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

// Naïve in-memory rate limiter. Each Netlify function instance keeps its own
// counter, which is fine for personal-portfolio traffic. Resets when the
// instance recycles.
const buckets: Map<string, { count: number; resetAt: number }> = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const rateLimit = (ip: string): boolean => {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
};

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export default async (req: Request, context: Context): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    });
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

  if (!rateLimit(ip)) {
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
