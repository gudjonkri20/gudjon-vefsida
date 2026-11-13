import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { pathWithoutLocale } from './lib/i18n';

const PAGE_ROUTES = [
  { path: '', element: <HomePage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'projects', element: <ProjectsPage /> },
  { path: 'projects/:slug', element: <ProjectDetailPage /> },
  { path: 'contact', element: <ContactPage /> },
];

const routeElements = (
  <>
    {PAGE_ROUTES.map(({ path, element }) => (
      <Route key={path} path={path === '' ? '/' : `/${path}`} element={element} />
    ))}
    {PAGE_ROUTES.map(({ path, element }) => (
      <Route
        key={`is-${path}`}
        path={path === '' ? '/is' : `/is/${path}`}
        element={element}
      />
    ))}
    <Route path="*" element={<NotFoundPage />} />
  </>
);

/**
 * Cross-fades between pages instead of snapping.
 *
 * Has to sit inside Router so it can read the location, and the Routes get
 * that same location explicitly — otherwise the outgoing page re-renders as
 * the incoming one while it is still exiting.
 */
// 'instant' matters: html sets scroll-behavior: smooth, which would otherwise
// animate the jump to the top.
const scrollToTop = () =>
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const reduce = useReducedMotion();

  // The page, ignoring language. Switching EN / IS re-renders the same page in
  // place: it should not fade out, and it should not throw the reader back to
  // the top of what they were reading.
  const page = pathWithoutLocale(location.pathname);

  // With no transition there is nothing to wait for, so reset on navigation.
  // With one, the reset happens in onExitComplete below instead: doing it here
  // would yank the outgoing page to the top while it is still on screen.
  useEffect(() => {
    if (reduce) scrollToTop();
  }, [page, reduce]);

  if (reduce) return <Routes location={location}>{routeElements}</Routes>;

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
      <motion.div
        key={page}
        // Navigation is the most repeated interaction on the site, so the old
        // page gets out of the way fast (a plain 110ms fade, no travel) and
        // only the arriving page is given any motion. The previous 280ms out +
        // 280ms in left over half a second with nothing to read.
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{ opacity: 0, transition: { duration: 0.11, ease: 'easeOut' } }}
      >
        <Routes location={location}>{routeElements}</Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-paper text-muted">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
