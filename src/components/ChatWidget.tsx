import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCcw } from 'lucide-react';
import Waveform from './Waveform';
import { useCurrentLocale } from '../lib/i18n';
import type { ChatMessage } from '../types';

const STORAGE_KEY = 'gk-chat-history-v1';
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface StoredHistory {
  ts: number;
  messages: ChatMessage[];
}

const loadHistory = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredHistory;
    if (!parsed.ts || Date.now() - parsed.ts > STORAGE_TTL_MS) return [];
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
};

const saveHistory = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredHistory = { ts: Date.now(), messages };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage may be full or disabled — just skip */
  }
};

const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate history once on mount
  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  // Persist on every change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, pending]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput('');
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || pending) return;

    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setError(null);
    setPending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next, language: locale }),
      });

      if (res.status === 503) {
        setError(t('chat.offline'));
        return;
      }
      if (res.status === 429) {
        setError(t('chat.rateLimited'));
        return;
      }
      if (!res.ok) {
        setError(t('chat.errorMessage'));
        return;
      }

      const data = (await res.json()) as { reply?: string };
      const reply = data.reply?.trim();
      if (!reply) {
        setError(t('chat.errorMessage'));
        return;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setError(t('chat.errorMessage'));
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const suggestions = (t('chat.suggestions', { returnObjects: true }) as unknown) as string[];

  const panelMotion = reduce
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.18, ease: 'easeOut' as const },
      };

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('chat.buttonLabel')}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-medium text-white shadow-card-hover transition-colors hover:bg-navy-800 md:bottom-8 md:right-8"
        initial={reduce ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">{t('chat.buttonLabel')}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            {...panelMotion}
            className="fixed bottom-20 right-0 z-50 flex w-full max-w-[420px] flex-col overflow-hidden border border-navy-100 bg-paper-raised shadow-card-hover md:bottom-24 md:right-8 md:rounded-lg"
            style={{ height: 'min(640px, calc(100vh - 6rem))' }}
            role="dialog"
            aria-label={t('chat.title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-navy-100 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-8 flex-none text-brass-500" aria-hidden>
                  <Waveform />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-navy-900">
                    {t('chat.title')}
                  </div>
                  <div className="truncate text-[11px] text-muted/80">
                    {t('chat.disclaimer')}
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label={t('chat.newChat')}
                    title={t('chat.newChat')}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-paper-sunken hover:text-navy-900"
                  >
                    <RefreshCcw size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="rounded p-1.5 text-muted transition-colors hover:bg-paper-sunken hover:text-navy-900"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="font-serif text-[0.9375rem] leading-relaxed text-muted">
                    {t('chat.subtitle')}
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="block w-full rounded-md border border-navy-100 bg-paper px-3 py-2 text-left text-sm text-navy-900 transition-colors hover:border-brass-500/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-navy-900 px-3.5 py-2 text-sm text-white'
                      : 'mr-auto max-w-[90%] rounded-lg rounded-bl-sm border border-navy-100 bg-paper px-3.5 py-2 text-sm text-navy-900'
                  }
                >
                  {m.content.split('\n').map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < m.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              ))}

              {pending && (
                <div className="mr-auto inline-flex max-w-[90%] items-center gap-1.5 rounded-lg rounded-bl-sm border border-navy-100 bg-paper px-3.5 py-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:300ms]" />
                  <span className="ml-1">{t('chat.thinking')}</span>
                </div>
              )}

              {error && (
                <div className="rounded-md border-l-2 border-brass-500 bg-brass-500/10 px-3 py-2 text-sm text-navy-900">
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-navy-100 bg-paper-raised p-3"
            >
              <div className="flex items-end gap-2 rounded-md border border-navy-100 bg-paper px-3 py-2 focus-within:border-brass-500/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={t('chat.placeholder')}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-navy-900 placeholder:text-muted/70 focus:outline-none"
                  style={{ maxHeight: 120 }}
                  disabled={pending}
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  aria-label={t('chat.send')}
                  className="grid h-8 w-8 flex-none place-items-center rounded bg-navy-900 text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-white/70"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
