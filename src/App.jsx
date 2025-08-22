import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './enhanced-styles.css';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Campaigns from './pages/Campaigns';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

// 404 Page Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <motion.a
        href="/"
        className="btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Home
      </motion.a>
    </motion.div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
      {/* Clean background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      <div className="absolute inset-0 bg-pattern opacity-3"></div>
      <div className="relative z-10">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      </div>
    </div>
  );
}

export default App;