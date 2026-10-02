import React from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConstellationCanvas from '../components/ConstellationCanvas';
import Reveal from '../components/Reveal';
import { useScrollProgress } from '../hooks/useScrollProgress';

const FOCUS_AREAS = [
  {
    title: 'Speech & Language',
    body: 'Fine-tuning wav2vec2 and BERT-family models for Icelandic, including bias analysis across demographic groups.',
    tags: ['wav2vec2', 'IceBERT', 'Transformers'],
  },
  {
    title: 'Applied Machine Learning',
    body: 'Taking models from notebook to something that actually runs — data pipelines, evaluation, and optimisation.',
    tags: ['PyTorch', 'Python', 'Evaluation'],
  },
  {
    title: 'Agentic & Conversational AI',
    body: 'Building chatbots and LLM-driven tools, from retrieval and prompting through to deployed serverless endpoints.',
    tags: ['LLMs', 'RAG', 'Serverless'],
  },
  {
    title: 'Statistics & Decision Making',
    body: 'Bayesian and hierarchical modelling for questions where the uncertainty matters as much as the estimate.',
    tags: ['Bayesian', 'R', 'Modelling'],
  },
];

const SOCIALS = [
  { href: 'https://github.com/gudjonkri20', label: 'GitHub', Icon: Github },
  {
    href: 'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  { href: 'mailto:gudjonk6@gmail.com', label: 'Email', Icon: Mail },
];

const HomePage: React.FC = () => {
  // Measured across the whole pinned section, so the morph
  // initials -> brain -> network finishes while the canvas is still on screen.
  const { ref: stageRef, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/*
        One tall stage: the left column scrolls, the right column is pinned.
        That pairing is what lets the constellation morph across the scroll
        instead of leaving the viewport a few hundred pixels in.
      */}
      <div
        ref={stageRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16">
          {/* Scrolling column */}
          <div>
            <Reveal>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hi, I&apos;m <span className="text-blue-400">Guðjón</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
                AI and Data Science expert
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                I have a strong passion for AI development, with hands-on
                experience in building, fine-tuning, and applying a variety of
                machine learning models. I am skilled in leveraging
                pre-existing models and frameworks, and I constantly stay
                updated on the latest trends and advancements in AI to ensure I
                am using the most effective techniques. My expertise spans
                across problem-solving, data processing, and model
                optimization, allowing me to create impactful AI solutions.
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
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-300 hover:text-white transition"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Mobile placement: no pinning to play against at one column. */}
            <div className="mt-12 flex justify-center md:hidden">
              <ConstellationCanvas
                progress={progress}
                ariaLabel="Animated constellation of points forming the initials GK, then a brain, then a neural network"
                className="w-full max-w-[22rem] aspect-square"
              />
            </div>

            <div className="mt-20 md:mt-28">
              <Reveal>
                <p className="text-sm font-mono uppercase tracking-[0.2em] text-blue-400 mb-3">
                  What I work on
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-10">
                  Four things I keep coming back to
                </h2>
              </Reveal>

              <div className="space-y-6">
                {FOCUS_AREAS.map((area, i) => (
                  <Reveal key={area.title} delay={i * 80}>
                    <div className="group rounded-xl border border-gray-700/70 bg-gray-800/40 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-gray-800/70">
                      <h3 className="text-xl font-semibold mb-2 transition-colors group-hover:text-blue-400">
                        {area.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{area.body}</p>
                      <div className="flex flex-wrap gap-2">
                        {area.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Pinned column */}
          <div className="hidden md:block">
            <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center justify-center">
              <ConstellationCanvas
                progress={progress}
                ariaLabel="Animated constellation of points forming the initials GK, then a brain, then a neural network"
                className="w-full max-w-[32rem] aspect-square cursor-crosshair"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Closing call to action */}
      <section className="border-t border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want the longer version?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              The projects page has the thesis work, the models on Hugging
              Face, and everything else worth showing.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              View Projects <ArrowRight className="ml-2" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
