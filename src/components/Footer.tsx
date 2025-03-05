import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Guðjón Kristjánsson. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/gudjonkri20" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <Linkedin size={20} />
            </a>
            <a href="mailto:gudjonk6@gmail.com" className="text-gray-300 hover:text-white">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;