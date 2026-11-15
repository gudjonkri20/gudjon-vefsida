import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';
import type { Project } from '../types';

/**
 * What an assistant reply is allowed to contain. Models write Markdown; until
 * now the panel printed it raw, asterisks and all. This renders the small
 * subset a short chat answer needs and unwraps everything else to plain text,
 * so a reply can never produce a heading, an image or a table in the bubble.
 */
const ALLOWED = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'br'];

/**
 * Projects a reply talks about, found by title in either language. The site
 * does this itself instead of asking the model to write links: a title
 * either is in the text or it is not, whereas a link the model composes can
 * be wrong.
 */
const mentioned = (content: string): Project[] => {
  const text = content.toLowerCase();
  return projects
    .filter(
      (p) =>
        text.includes(p.title.en.toLowerCase()) || text.includes(p.title.is.toLowerCase()),
    )
    .slice(0, 4);
};

interface AssistantMessageProps {
  content: string;
  /** True while the reply is still arriving. */
  streaming?: boolean;
  /** Called when a link inside the reply takes the visitor to another page. */
  onNavigate?: () => void;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  streaming = false,
  onNavigate,
}) => {
  const locale = useCurrentLocale();
  // Not while it is still being written: a card should not pop in under a
  // sentence that is only half there.
  const related = useMemo(() => (streaming ? [] : mentioned(content)), [content, streaming]);

  return (
    <div className="mr-auto max-w-[90%]">
      <div className="rounded-lg rounded-bl-sm border border-navy-100 bg-paper px-3.5 py-2 text-sm leading-relaxed text-navy-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          allowedElements={ALLOWED}
          unwrapDisallowed
          components={{
            p: ({ children }) => <p className="[&:not(:first-child)]:mt-2">{children}</p>,
            ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>,
            ol: ({ children }) => (
              <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>
            ),
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            code: ({ children }) => (
              <code className="rounded bg-paper-sunken px-1 py-0.5 font-mono text-[0.8125rem]">
                {children}
              </code>
            ),
            a: ({ href, children }) =>
              href?.startsWith('/') ? (
                <Link to={href} onClick={onNavigate} className="link-inline">
                  {children}
                </Link>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-inline"
                >
                  {children}
                </a>
              ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* The answer names a project; the next step is its page. */}
      {related.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {related.map((project) => (
            <Link
              key={project.slug}
              to={localizedHref(`/projects/${project.slug}`, locale)}
              onClick={onNavigate}
              className="press inline-flex min-h-11 items-center gap-1 rounded border border-navy-100 bg-paper-raised px-2.5 text-xs font-medium text-navy-900 hover:border-brass-500/60 active:bg-paper-sunken"
            >
              {project.title[locale]}
              <ArrowUpRight size={13} className="text-brass-600" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantMessage;
