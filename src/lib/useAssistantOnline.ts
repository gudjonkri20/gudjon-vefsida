import { useEffect, useState } from 'react';

const ONLINE_KEY = 'gk-chat-online';

/**
 * Whether the assistant can answer right now, as reported by the chat
 * function's status probe (GET /api/chat).
 *
 * Anything that invites a question — the ask bar in the hero, the "ask about
 * this project" button — must not be offered when the question would only
 * come back as "AI is offline". It starts from the last known answer for this
 * tab so those controls do not blink out and back in on every page, and
 * anything other than a clear "yes" — a failed request, a non-JSON reply, no
 * key configured — counts as no.
 */
export function useAssistantOnline(): boolean {
  const [online, setOnline] = useState(() => {
    try {
      return window.sessionStorage.getItem(ONLINE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let current = true;
    fetch('/api/chat')
      .then((res) => (res.ok ? res.json() : { online: false }))
      .then((data: { online?: unknown }) => data.online === true)
      .catch(() => false)
      .then((value) => {
        if (!current) return;
        setOnline(value);
        try {
          window.sessionStorage.setItem(ONLINE_KEY, value ? '1' : '0');
        } catch {
          /* storage unavailable — the answer just is not remembered */
        }
      });
    return () => {
      current = false;
    };
  }, []);

  return online;
}

/** Hands a question to the chat panel, which opens and sends it. */
export function askAssistant(question: string): void {
  window.dispatchEvent(new CustomEvent<string>('gk:ask', { detail: question }));
}
