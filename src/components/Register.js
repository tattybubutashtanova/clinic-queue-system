import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, validatePatientForm } from '../utils/helpers';
import { DEPARTMENTS, DEPARTMENT_TRANSLATIONS, UPDATE_INTERVAL } from '../utils/constants';

function Register() {
  const { language, switchLanguage } = useLanguageContext();
  console.log('Register component - Current language:', language);
  console.log('Available translations:', DEPARTMENT_TRANSLATIONS);
  console.log('DEPARTMENTS array:', DEPARTMENTS);
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    department: DEPARTMENTS[0],
    phone: '',
    email: '',
    day: getCurrentDate()
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registeredPatient, setRegisteredPatient] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const data = await apiService.getTimeSlots({
        day: formData.day,
        department: formData.department
      });
      const sortedSlots = sortPatientsByTime(data.timeSlots || []);
      setTimeSlots(sortedSlots);
    } catch (err) {
      console.error('Failed to load time slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadTimeSlots();
  }, [formData.day, formData.department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('HandleSubmit triggered');
    
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    const validation = validatePatientForm({
      ...formData,
      time: selectedSlot?.time
    });
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    if (!formData.name || !formData.phone || !formData.day || !formData.department) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const patientData = {
        name: formData.name,
        department: formData.department,
        phone: formData.phone,
        email: formData.email,
        day: formData.day,
        time: selectedSlot.time,
        timeSlotId: selectedSlot.id
      };

      console.log('Sending registration data:', patientData);
      const data = await apiService.registerPatient(patientData);
      console.log('Registration response:', data);
      
      if (data.success) {
        setRegisteredPatient(data.patient);
        setSuccess('Appointment booked successfully!');
        setError('');
        // Clear form
        setFormData({
          name: '',
          department: DEPARTMENTS[0],
          phone: '',
          email: '',
          day: getCurrentDate()
        });
        setSelectedSlot(null);
        
        // Refresh slots to show updated availability
        loadTimeSlots();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slot) => {
    if (!slot.isAvailable) return 'booked';
    if (slot.currentBookings >= slot.maxPatients) return 'full';
    return 'available';
  };

  const getSlotStatusColor = (status) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'booked': return 'status-booked';
      case 'full': return 'status-full';
      default: return '';
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
        className="register-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2>{getText(language, 'registerPatient')}</h2>
        
        {error && (
          <motion.div 
            className="alert alert-error"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="alert alert-success"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {success}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {getText(language, 'fullName')}
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              placeholder={getText(language, 'fullName')}
              required
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
              key={language} // Force re-render when language changes
              required
            >
              {DEPARTMENTS.map(dept => {
                // Map the department name to its translation key (e.g., 'General' -> 'general')
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

          <div className="form-group">
            <label className="form-label">
              {getText(language, 'phone')}
            </label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              placeholder={getText(language, 'phone')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {getText(language, 'email')}
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              placeholder={getText(language, 'email')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {getText(language, 'day')}
            </label>
            <input
              type="date"
              name="day"
              className="form-input"
              value={formData.day}
              onChange={handleInputChange}
              disabled={loading}
              min={getCurrentDate()}
              required
            />
          </div>

          {/* Time Slots Section inside the form */}
          <div className="time-slots-section">
            <h3>{getText(language, 'availableTimeSlots')}</h3>
            
            {loadingSlots ? (
              <div className="loading-slots">
                <div className="loading"></div>
                <p>{getText(language, 'loadingTimeSlots')}</p>
              </div>
            ) : (
              <div className="time-slots-grid">
                {timeSlots.map(slot => {
                  const status = getSlotStatus(slot);
                  const isSelected = selectedSlot?.id === slot.id;
                  
                  return (
                    <motion.div
                      key={slot.id}
                      className={`time-slot ${getSlotStatusColor(status)} ${isSelected ? 'selected' : ''}`}
                      whileHover={{ scale: status === 'available' ? 1.02 : 1 }}
                      whileTap={{ scale: status === 'available' ? 0.98 : 1 }}
                      onClick={() => status === 'available' && setSelectedSlot(slot)}
                    >
                      <div className="slot-time">{slot.time}</div>
                      <div className="slot-status">
                        {status === 'available' && `${slot.maxPatients - slot.currentBookings} spots left`}
                        {status === 'full' && 'Full'}
                        {status === 'booked' && 'Booked'}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {selectedSlot && (
              <motion.div 
                className="selected-slot-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>Selected: <strong>{selectedSlot.time}</strong></p>
              </motion.div>
            )}
          </div>

          <motion.button 
            type="submit" 
            className="btn"
            disabled={loading || !selectedSlot}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: '20px', width: '100%' }}
          >
            {loading ? (
              <span className="loading-inline">
                <span className="loading"></span>
                {getText(language, 'loading')}
              </span>
            ) : (
              getText(language, 'register')
            )}
          </motion.button>
        </form>

        <div className="register-footer">
          <motion.button
            type="button"
            onClick={switchLanguage}
            className="lang-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language.toUpperCase()}
          </motion.button>
        </div>
      </motion.div>

      {/* Appointment Confirmation */}
      {registeredPatient && (
        <motion.div
          className="appointment-confirmation"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>{getText(language, 'appointmentConfirmed')}</h3>
          <div className="confirmation-details">
            <p><strong>{getText(language, 'queueNumber')}:</strong> {registeredPatient.queueNumber}</p>
            <p><strong>{getText(language, 'department')}:</strong> {formData.department}</p>
            <p><strong>{getText(language, 'day')}:</strong> {formData.day}</p>
            <p><strong>{getText(language, 'time')}:</strong> {registeredPatient.timeSlot?.time}</p>
            <p><strong>{getText(language, 'status')}:</strong> {registeredPatient.status}</p>
          </div>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Register;
