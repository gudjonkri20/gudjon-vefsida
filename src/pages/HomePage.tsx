import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatBot from '../components/ChatBot';

const HomePage: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    const fetchGithubAvatar = async () => {
      try {
        const response = await fetch('https://api.github.com/users/gudjonkri20');
        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching GitHub avatar:', error);
      }
    };

    fetchGithubAvatar();
  }, []);

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
        setLoadError(`Failed to load content. Please try again later.`);
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hi, I'm <span className="text-blue-400">Guðjón</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
              AI and Data Science expert
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              I have a strong passion for AI development, with hands-on experience in building, fine-tuning, and applying a variety of machine learning models. I am skilled in leveraging pre-existing models and frameworks, and I constantly stay updated on the latest trends and advancements in AI to ensure I am using the most effective techniques. My expertise spans across problem-solving, data processing, and model optimization, allowing me to create impactful AI solutions.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                About Me <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-white hover:bg-gray-700 transition"
              >
                View Projects
              </Link>
              <a
                href="/resume.pdf"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-white hover:bg-gray-700 transition"
              >
                Resume <Download className="ml-2" size={18} />
              </a>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/gudjonkri20" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Linkedin size={24} />
              </a>
              <a href="mailto:gudjonk6@gmail.com" className="text-gray-300 hover:text-white">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-400">
              <img
                src={avatarUrl || 'https://github.com/gudjonkri20.png'}
                alt="Guðjón Kristjánsson"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Ask Me Anything</h2>
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-800">
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p>Loading chatbot data...</p>
              </div>
            ) : loadError ? (
              <div className="bg-white shadow-md rounded-lg p-8 text-center text-red-600">
                <p className="font-semibold mb-2">Error loading chatbot data</p>
                <p className="text-sm">{loadError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ChatBot aboutContent={aboutContent} />
            )}
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Python', 'Data Science', 'Machine Learning', 'AI', 'R', 'SQL', 'JavaScript', 'React'].map((skill) => (
              <div key={skill} className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition">
                <p className="font-medium">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;