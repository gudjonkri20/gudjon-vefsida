import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
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
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_50px_15px_rgba(59,130,246,0.5)]">
                <img
                  src={avatarUrl || 'https://github.com/gudjonkri20.png'}
                  alt="Guðjón Kristjánsson"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;