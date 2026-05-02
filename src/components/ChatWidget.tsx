import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCcw, Sparkles } from 'lucide-react';
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
        initial: { opacity: 0, y: 16, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.96 },
        transition: { duration: 0.18, ease: 'easeOut' as const },
      };

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('chat.buttonLabel')}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-brand-400 px-4 py-3 text-sm font-medium text-slate-950 shadow-glow transition hover:bg-brand-300 md:bottom-8 md:right-8"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
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
            className="fixed bottom-20 right-0 z-50 flex w-full max-w-[420px] flex-col overflow-hidden rounded-none border border-slate-800 bg-slate-950 shadow-2xl md:bottom-24 md:right-8 md:rounded-2xl"
            style={{ height: 'min(640px, calc(100vh - 6rem))' }}
            role="dialog"
            aria-label={t('chat.title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-400" />
                <div>
                  <div className="font-display text-sm font-semibold text-white">
                    {t('chat.title')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t('chat.disclaimer')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label={t('chat.newChat')}
                    title={t('chat.newChat')}
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-900 hover:text-white"
                  >
                    <RefreshCcw size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">{t('chat.subtitle')}</p>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-brand-400/40 hover:text-white"
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
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-400 px-3.5 py-2 text-sm text-slate-950'
                      : 'mr-auto max-w-[90%] rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-slate-100'
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
                <div className="mr-auto inline-flex max-w-[90%] items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400 [animation-delay:300ms]" />
                  <span className="ml-1">{t('chat.thinking')}</span>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-800 bg-slate-950 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 focus-within:border-brand-400/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={t('chat.placeholder')}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  style={{ maxHeight: 120 }}
                  disabled={pending}
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  aria-label={t('chat.send')}
                  className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-400 text-slate-950 transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
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
