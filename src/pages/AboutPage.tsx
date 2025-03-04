import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      } catch (error) {
        console.error('Error loading about content:', error);
        setError(`Failed to load content. Please try again later.`);
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700">Loading content...</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;