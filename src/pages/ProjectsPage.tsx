import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  huggingfaceUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Age and Gender Bias in Icelandic ASR Systems',
    description: 'Masters thesis project investigating bias in Icelandic automatic speech recognition systems. The project uses the Samrómur Milljón dataset and fine-tunes the wav2vec2-large-xlsr-53 model to analyze performance differences across demographic groups.',
    image: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    technologies: ['Python', 'PyTorch', 'Transformers', 'wav2vec2', 'Speech Recognition', 'Machine Learning'],
    huggingfaceUrl: 'https://huggingface.co/collections/gudjonk93/masters-project-6790dd537bd0b8ddcd36f95d',
  },
  {
    id: 2,
    title: 'IceBERT Question Answering Model',
    description: 'A fine-tuned BERT model for Icelandic question answering, based on IceBERT. The model is trained to understand and answer questions in Icelandic, demonstrating strong performance on natural language understanding tasks.',
    image: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    technologies: ['Python', 'PyTorch', 'Transformers', 'BERT', 'Natural Language Processing', 'Question Answering'],
    huggingfaceUrl: 'https://huggingface.co/gudjonk93/IceBERT-finetuned-NQiIv.1.1',
  },
  {
    id: 3,
    title: 'Personal Website',
    description: 'My personal website built with React, TypeScript, and Tailwind CSS. Features a responsive design showcasing my projects and experience.',
    image: 'https://raw.githubusercontent.com/gudjonkri20/gudjon-vefsida/main/public/website-preview.png',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
    githubUrl: 'https://github.com/gudjonkri20/gudjon-vefsida',
  },
  {
    id: 4,
    title: 'Decision Making Exam Project',
    description: 'A Bayesian analysis project examining the relationship between offshore household wealth and Public Goods Game outcomes. Uses hierarchical modeling to investigate how wealth affects both group contributions and individual decision-making parameters including conditional cooperation, learning weight, and initial beliefs.',
    image: 'https://raw.githubusercontent.com/gudjonkri20/DecisionMakingExam/main/preview.png',
    technologies: ['Python', 'Bayesian Analysis', 'Statistical Modeling', 'Data Analysis', 'R'],
    githubUrl: 'https://github.com/gudjonkri20/DecisionMakingExam',
  }
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-700 hover:text-gray-900"
                    >
                      <Github size={18} className="mr-1" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={18} className="mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.huggingfaceUrl && (
                    <a 
                      href={project.huggingfaceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={18} className="mr-1" />
                      View on Hugging Face
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;