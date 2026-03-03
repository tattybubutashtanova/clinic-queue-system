import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Clock, Shield, Calendar } from 'lucide-react';
import { getText } from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

function Home() {
  return (
    <motion.div 
      className="container text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="hero-section"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hero-icon"
        >
          <Calendar size={60} className="medical-icon" />
        </motion.div>
        
        <motion.h1 
          className="main-title"
          variants={itemVariants}
        >
          {getText('en', 'title')}
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          variants={itemVariants}
        >
          Professional appointment scheduling and queue management
        </motion.p>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="features-grid"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="feature-card">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="feature-icon"
          >
            <Users size={40} />
          </motion.div>
          <h3>Book Appointment</h3>
          <p>Schedule your visit with available time slots</p>
        </motion.div>

        <motion.div variants={itemVariants} className="feature-card">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="feature-icon"
          >
            <Stethoscope size={40} />
          </motion.div>
          <h3>Doctor Portal</h3>
          <p>Manage appointments and patient queues</p>
        </motion.div>

        <motion.div variants={itemVariants} className="feature-card">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="feature-icon"
          >
            <Shield size={40} />
          </motion.div>
          <h3>Secure & Reliable</h3>
          <p>Professional healthcare management system</p>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="action-buttons"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/register" className="btn btn-primary">
            <Users size={20} />
            Book Appointment
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login" className="btn btn-secondary">
            <Stethoscope size={20} />
            Doctor Login
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="stats-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="stat-item">
          <div className="stat-number">80+</div>
          <div className="stat-label">Daily Patients</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-item">
          <div className="stat-number">number of</div>
          <div className="stat-label">Departments</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-item">
          <div className="stat-number">number of</div>
          <div className="stat-label">Medical Staff</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Home;
