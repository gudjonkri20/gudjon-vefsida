import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {PAGE_ROUTES.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path === '' ? '/' : `/${path}`}
                  element={element}
                />
              ))}
              {PAGE_ROUTES.map(({ path, element }) => (
                <Route
                  key={`is-${path}`}
                  path={path === '' ? '/is' : `/is/${path}`}
                  element={element}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
