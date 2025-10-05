import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './enhanced-styles.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Campaigns from './pages/Campaigns';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Events from './pages/Events';
import AdminEvents from './pages/AdminEvents';
import AdminLogin from './pages/AdminLogin';

// 404 Page Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-nurturing">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-6xl font-bold text-gradient-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-soft-800 mb-4">Page Not Found</h2>
      <p className="text-soft-600 mb-8">The page you're looking for doesn't exist.</p>
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
    <AuthProvider>
      <div className="min-h-screen bg-gradient-nurturing relative">
        {/* Beautiful nurturing background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-nurturing"></div>
        <div className="absolute inset-0 bg-pattern opacity-2"></div>
        <div className="relative z-10">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/events" element={<Events />} />
            
            {/* Authentication routes */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <AdminLogin />
              </ProtectedRoute>
            } />
            
            {/* Protected admin routes */}
            <Route path="/admin/events" element={
              <ProtectedRoute requireAuth={true}>
                <AdminEvents />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;