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
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const reduce = useReducedMotion();

  // The site had no scroll restoration, and arriving halfway down a new page
  // is far more jarring once pages fade into each other. 'instant' matters:
  // html sets scroll-behavior: smooth, which would otherwise animate this.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  if (reduce) return <Routes location={location}>{routeElements}</Routes>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
