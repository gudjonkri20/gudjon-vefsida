import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Reveal from '../components/Reveal';

const AboutPage: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/about.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch about.md: ${response.status}`);
        }
        const text = await response.text();
        if (!text || text.trim() === '') {
          throw new Error('The about.md file is empty');
        }
        setAboutContent(text);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading about content:', err);
        setError('Failed to load content. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* The portrait the hero gave up to the constellation. */}
        <Reveal>
          <div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-400/40 shadow-[0_0_40px_-8px_rgba(96,165,250,0.6)]">
              <img
                src="https://github.com/gudjonkri20.png"
                alt="Guðjón Kristjánsson"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-mono uppercase tracking-[0.2em] text-blue-400 mb-2">
                About
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Guðjón Kristjánsson
              </h1>
            </div>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="rounded-xl border border-gray-700/70 bg-gray-800/40 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
            </div>
            <p className="text-gray-300">Loading content...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-gray-700/70 bg-gray-800/40 p-8">
            <h2 className="mb-4 text-2xl font-bold text-red-400">
              Error Loading Content
            </h2>
            <p className="mb-4 text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <Reveal>
            <div className="rounded-xl border border-gray-700/70 bg-gray-800/40 p-6 md:p-8">
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aboutContent}
                </ReactMarkdown>
              </article>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
