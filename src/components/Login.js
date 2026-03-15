import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, validateLoginForm } from '../utils/helpers';
import { DEPARTMENTS, DEPARTMENT_TRANSLATIONS, UPDATE_INTERVAL } from '../utils/constants';

function Login() {
  const { language, switchLanguage } = useLanguageContext();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    department: DEPARTMENTS[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiService.loginDoctor(formData);
      
      if (data.success) {
        // Store doctor info in localStorage for use in dashboard
        localStorage.setItem('doctorInfo', JSON.stringify(data.doctor));
        navigate('/doctor');
      } else {
        setError(getText(language, 'wrongCredentials'));
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2>{getText(language, 'doctorDashboard')}</h2>
        
        {error && (
          <motion.div 
            className="alert alert-error"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {getText(language, 'username')}
            </label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              placeholder={getText(language, 'enterUsername')}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              {getText(language, 'password')}
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              placeholder={getText(language, 'enterPassword')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {getText(language, 'department')}
            </label>
            <select
              name="department"
              className="form-input"
              value={formData.department}
              onChange={handleInputChange}
              disabled={loading}
              key={language}
            >
              {DEPARTMENTS.map(dept => {
                const translationKey = dept.toLowerCase();
                const translation = DEPARTMENT_TRANSLATIONS[language]?.[translationKey];
                return (
                  <option key={dept} value={dept}>
                    {translation || dept}
                  </option>
                );
              })}
            </select>
          </div>
          
          <motion.button 
            type="submit" 
            className="btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="loading-inline">
                <span className="loading"></span>
                {getText(language, 'loading')}
              </span>
            ) : (
              getText(language, 'login')
            )}
          </motion.button>
        </form>

        <div className="login-footer">
          <motion.button
            type="button"
            onClick={switchLanguage}
            className="lang-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language.toUpperCase()}
          </motion.button>

          <motion.div
            className="demo-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>{getText(language, 'demoCredentials')}:</p>
            <p>{getText(language, 'username')}: <strong>{getText(language, 'demoUsername')}</strong></p>
            <p>{getText(language, 'password')}: <strong>{getText(language, 'demoPassword')}</strong></p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
