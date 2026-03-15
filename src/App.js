import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HelpModal from './components/common/HelpModal';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Doctor from './components/Doctor';
import Patient from './components/Patient';
import { LanguageProvider } from './contexts/LanguageContext';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="page-wrapper"
  >
    {children}
  </motion.div>
);

function App() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  return (
    <LanguageProvider>
      <div className="App">
        <Navbar onHelpClick={openHelpModal} />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                } />
            <Route path="/login" element={
                  <PageWrapper>
                    <Login />
                  </PageWrapper>
                } />
            <Route path="/register" element={
                  <PageWrapper>
                    <Register />
                  </PageWrapper>
                } />
            <Route path="/doctor" element={
                  <PageWrapper>
                    <Doctor />
                  </PageWrapper>
                } />
            <Route path="/patient" element={
                  <PageWrapper>
                    <Patient />
                  </PageWrapper>
                } />
          </Routes>
        </AnimatePresence>

        <HelpModal 
          isOpen={isHelpModalOpen} 
          onClose={closeHelpModal} 
        />
        
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
