import React from 'react';
import { Github, ExternalLink, Brain, Globe, LineChart } from 'lucide-react';
import Reveal from '../components/Reveal';

type Kind = 'model' | 'web' | 'research';

interface Project {
  id: number;
  title: string;
  description: string;
  /** Picks the generated card header, replacing the old broken image URLs. */
  kind: Kind;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  huggingfaceUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Age and Gender Bias in Icelandic ASR Systems',
    description:
      'Masters thesis project investigating bias in Icelandic automatic speech recognition systems. The project uses the Samrómur Milljón dataset and fine-tunes the wav2vec2-large-xlsr-53 model to analyze performance differences across demographic groups.',
    kind: 'model',
    technologies: [
      'Python',
      'PyTorch',
      'Transformers',
      'wav2vec2',
      'Speech Recognition',
      'Machine Learning',
    ],
    huggingfaceUrl:
      'https://huggingface.co/collections/gudjonk93/masters-project-6790dd537bd0b8ddcd36f95d',
  },
  {
    id: 2,
    title: 'IceBERT Question Answering Model',
    description:
      'A fine-tuned BERT model for Icelandic question answering, based on IceBERT. The model is trained to understand and answer questions in Icelandic, demonstrating strong performance on natural language understanding tasks.',
    kind: 'model',
    technologies: [
      'Python',
      'PyTorch',
      'Transformers',
      'BERT',
      'Natural Language Processing',
      'Question Answering',
    ],
    huggingfaceUrl:
      'https://huggingface.co/gudjonk93/IceBERT-finetuned-NQiIv.1.1',
  },
  {
    id: 3,
    title: 'Personal Website',
    description:
      'My personal website built with React, TypeScript, and Tailwind CSS. Features a responsive design showcasing my projects and experience.',
    kind: 'web',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
    githubUrl: 'https://github.com/gudjonkri20/gudjon-vefsida',
  },
  {
    id: 4,
    title: 'Decision Making Exam Project',
    description:
      'A Bayesian analysis project examining the relationship between offshore household wealth and Public Goods Game outcomes. Uses hierarchical modeling to investigate how wealth affects both group contributions and individual decision-making parameters including conditional cooperation, learning weight, and initial beliefs.',
    kind: 'research',
    technologies: [
      'Python',
      'Bayesian Analysis',
      'Statistical Modeling',
      'Data Analysis',
      'R',
    ],
    githubUrl: 'https://github.com/gudjonkri20/DecisionMakingExam',
  },
];

const KIND_STYLES: Record<
  Kind,
  { icon: React.ElementType; label: string; from: string; glow: string }
> = {
  model: {
    icon: Brain,
    label: 'Model',
    from: 'from-blue-500/25',
    glow: 'text-blue-300',
  },
  web: {
    icon: Globe,
    label: 'Web',
    from: 'from-cyan-500/25',
    glow: 'text-cyan-300',
  },
  research: {
    icon: LineChart,
    label: 'Research',
    from: 'from-violet-500/25',
    glow: 'text-violet-300',
  },
};

/**
 * Generated card header. Replaces the previous <img>, where two of the four
 * remote URLs 404ed and the other two rendered an oversized vendor logo.
 */
const CardHeader: React.FC<{ kind: Kind }> = ({ kind }) => {
  const { icon: Icon, label, from, glow } = KIND_STYLES[kind];
  return (
    <div
      className={`relative h-32 overflow-hidden bg-gradient-to-br ${from} to-transparent`}
    >
      {/* Faint dot grid, echoing the hero constellation. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${glow} opacity-30 transition-opacity duration-500 group-hover:opacity-70`}
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="relative flex h-full items-center justify-between px-6">
        <Icon
          size={34}
          className={`${glow} transition-transform duration-500 group-hover:scale-110`}
        />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal>
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-blue-400 mb-3">
            Selected work
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-12">My Projects</h1>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-700/70 bg-gray-800/40 transition duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:bg-gray-800/70 hover:shadow-[0_18px_40px_-18px_rgba(96,165,250,0.45)]">
                <CardHeader kind={project.kind} />

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold mb-2 transition-colors group-hover:text-blue-400">
                    {project.title}
                  </h2>
                  <p className="text-gray-300 mb-4">{project.description}</p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-4 border-t border-gray-700/70 pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-gray-300 transition hover:text-white"
                      >
                        <Github size={16} className="mr-1.5" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-400 transition hover:text-blue-300"
                      >
                        <ExternalLink size={16} className="mr-1.5" />
                        Live Demo
                      </a>
                    )}
                    {project.huggingfaceUrl && (
                      <a
                        href={project.huggingfaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-400 transition hover:text-blue-300"
                      >
                        <ExternalLink size={16} className="mr-1.5" />
                        Hugging Face
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
