import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCcw } from 'lucide-react';
import Waveform from './Waveform';
import { useCurrentLocale } from '../lib/i18n';
import type { ChatMessage } from '../types';

const STORAGE_KEY = 'gk-chat-history-v1';
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const PANEL_ID = 'chat-panel';

// A new bubble confirms the message landed: a 6px rise over 200ms on the
// site's own ease-out, so it arrives rather than appears.
const BUBBLE_FROM = { opacity: 0, y: 6 };
const BUBBLE_TO = { opacity: 1, y: 0 };
const BUBBLE_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

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
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Hydrate history once on mount
  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  // Persist on every change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // How many messages have already been on screen. A bubble past this count
  // is new and rises in; everything before it — restored history, or the
  // whole thread when the panel is reopened — is simply there.
  const seenCount = useRef(0);
  useEffect(() => {
    seenCount.current = messages.length;
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, pending]);

  // Move focus into the panel on open. With a mouse and keyboard that means
  // the input, so you can just start typing. On a touch screen focusing the
  // input would throw the keyboard up over the suggested questions before
  // anyone has read them, so there the panel itself takes focus instead.
  useEffect(() => {
    if (!open) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    // The panel is looked up by id rather than held in a ref: a ref on the
    // direct child of AnimatePresence makes Framer read `props.ref`, which
    // React 18 warns about on every open.
    requestAnimationFrame(() =>
      (finePointer ? inputRef.current : document.getElementById(PANEL_ID))?.focus(),
    );
  }, [open]);

  // Closing hands focus back to the button that opened the panel, so a
  // keyboard or screen-reader user is not dropped at the top of the page.
  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Escape closes, from anywhere on the page while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput('');
    inputRef.current?.focus();
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
    // Enter while an IME is composing confirms the composition, not the message.
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const suggestions = (t('chat.suggestions', { returnObjects: true }) as unknown) as string[];

  // The panel grows out of the launcher and shrinks back into it: the scale
  // pivots on the bottom-left corner, where the button is, so it is obvious
  // where the panel came from and where it went. A spring with no bounce —
  // nothing was thrown, so nothing should overshoot — and because it is a
  // spring, closing mid-open reverses from wherever the panel has got to.
  const panelMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        initial: { opacity: 0, y: 10, scale: 0.96 },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring' as const, bounce: 0, duration: 0.32 },
        },
        exit: {
          opacity: 0,
          y: 8,
          scale: 0.97,
          transition: { duration: 0.14, ease: 'easeOut' as const },
        },
      };

  return (
    <>
      {/*
        Launcher. The wrapper carries the one-off entrance; the button inside
        carries the press state. They are separate elements because Framer
        writes an inline transform, which would silently override the CSS
        :active scale if both lived on the same node.

        Bottom-left, not the conventional bottom-right. On the live site
        Netlify's free-tier "Powered by Netlify" badge is injected into the
        bottom-right corner (197x64) and sat directly on top of this button,
        so taps went to the badge. That corner is not ours to use; move this
        back if the badge ever goes away.

        The hairline ring gives the button an edge on the navy bands, where a
        navy button otherwise has none and reads as loose text.
      */}
      <motion.div
        className="fixed bottom-5 left-5 z-50 md:bottom-8 md:left-8"
        initial={reduce ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
      >
        <button
          ref={launcherRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={t('chat.buttonLabel')}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          className="press inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-md bg-navy-900 px-4 text-sm font-medium text-white shadow-card-hover ring-1 ring-white/25 hover:bg-navy-800"
        >
          {open ? <X size={18} /> : <MessageCircle size={18} />}
          <span className="hidden sm:inline">{t('chat.buttonLabel')}</span>
        </button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            {...panelMotion}
            id={PANEL_ID}
            tabIndex={-1}
            // A floating card at every width — inset from the screen edges on
            // a phone rather than a square slab glued to them. dvh, not vh:
            // on a phone 100vh includes the area under the browser toolbar,
            // which pushed the header out of reach. The 9.5rem leaves the
            // launcher below and the 64px masthead above both uncovered.
            className="fixed bottom-20 left-3 right-3 z-50 flex h-[min(640px,calc(100vh-9.5rem))] flex-col overflow-hidden rounded-lg border border-navy-100 bg-paper-raised shadow-card-hover focus:outline-none supports-[height:100dvh]:h-[min(640px,calc(100dvh-9.5rem))] sm:left-5 sm:right-auto sm:w-[420px] md:bottom-24 md:left-8"
            style={{ transformOrigin: 'bottom left' }}
            role="dialog"
            aria-label={t('chat.title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-navy-100 py-2 pl-4 pr-2">
              <div className="flex min-w-0 items-center gap-3">
                {/* The mark pulses while a reply is being written. */}
                <span className="w-8 flex-none text-brass-500" aria-hidden>
                  <Waveform speaking={pending} />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-navy-900">
                    {t('chat.title')}
                  </div>
                  <div className="truncate text-[0.6875rem] text-muted">
                    {t('chat.disclaimer')}
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label={t('chat.newChat')}
                    title={t('chat.newChat')}
                    className="press grid h-11 w-11 place-items-center rounded text-muted hover:bg-paper-sunken hover:text-navy-900 active:bg-paper-sunken"
                  >
                    <RefreshCcw size={15} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('common.close')}
                  className="press grid h-11 w-11 place-items-center rounded text-muted hover:bg-paper-sunken hover:text-navy-900 active:bg-paper-sunken"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Body. role="log" so a screen reader announces each reply as it
                arrives instead of leaving it silently on screen. */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
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
                        className="press block min-h-11 w-full rounded-md border border-navy-100 bg-paper px-3 py-2 text-left text-sm text-navy-900 hover:border-brass-500/50 active:border-brass-500/50 active:bg-paper-sunken"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={i >= seenCount.current ? BUBBLE_FROM : false}
                  animate={BUBBLE_TO}
                  transition={BUBBLE_TRANSITION}
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
                </motion.div>
              ))}

              {pending && (
                <motion.div
                  initial={BUBBLE_FROM}
                  animate={BUBBLE_TO}
                  transition={BUBBLE_TRANSITION}
                  className="mr-auto inline-flex max-w-[90%] items-center gap-1.5 rounded-lg rounded-bl-sm border border-navy-100 bg-paper px-3.5 py-2 text-sm text-muted"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500 [animation-delay:300ms]" />
                  <span className="ml-1">{t('chat.thinking')}</span>
                </motion.div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-md border-l-2 border-brass-500 bg-brass-500/10 px-3 py-2 text-sm text-navy-900"
                >
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-navy-100 bg-paper-raised p-3"
            >
              <div className="flex items-end gap-2 rounded-md border border-navy-100 bg-paper py-1 pl-3 pr-1 focus-within:border-brass-500/60">
                {/*
                  16px on a phone: iOS zooms the whole page when a focused
                  field is any smaller, and does not zoom back out.

                  Never disabled. Disabling it while a reply was pending threw
                  focus out of the field, so the next question meant tapping
                  back in first. send() already ignores a second message
                  mid-reply; the field can stay live and be typed into.
                */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={t('chat.placeholder')}
                  aria-label={t('chat.placeholder')}
                  enterKeyHint="send"
                  rows={1}
                  className="max-h-[120px] flex-1 resize-none bg-transparent py-2.5 text-base leading-6 text-navy-900 [field-sizing:content] placeholder:text-muted focus:outline-none md:text-sm md:leading-6"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  aria-label={t('chat.send')}
                  className="press grid h-11 w-11 flex-none place-items-center rounded bg-navy-900 text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-100 disabled:text-navy-600 disabled:active:scale-100"
                >
                  <Send size={15} />
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
