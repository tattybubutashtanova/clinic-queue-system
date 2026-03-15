import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, calculateQueuePosition, validatePatientForm } from '../utils/helpers';
import { DEPARTMENTS, UPDATE_INTERVAL, STATUS_COLORS } from '../utils/constants';

function Patient() {
  const { language, switchLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    department: DEPARTMENTS[0],
    time: '',
    day: getCurrentDate()
  });
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [queueInfo, setQueueInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const registerPatient = async (e) => {
    e.preventDefault();
    
    const validation = validatePatientForm(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiService.registerPatient(formData);
      setCurrentPatientId(data.id);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateQueueInfo = async () => {
    if (!currentPatientId) return;
    
    try {
      const allPatients = await apiService.getPatients(formData.day);
      const me = allPatients.find(p => p.id === currentPatientId);
      
      if (me) {
        const position = calculateQueuePosition(allPatients, me);
        setQueueInfo({
          queueNumber: me.queueNumber,
          position,
          status: me.status,
          statusClass: STATUS_COLORS[me.status] || ''
        });
      }
    } catch (err) {
      console.error('Failed to update queue info:', err);
    }
  };

  useEffect(() => {
    if (currentPatientId) {
      updateQueueInfo();
    }
  }, [currentPatientId, formData.day]);

  useInterval(updateQueueInfo, currentPatientId ? UPDATE_INTERVAL : null);

  return (
    <div className="container">
      <h2>{getText(language, 'registerPatient')}</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={registerPatient}>
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
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            {getText(language, 'time')}
          </label>
          <input
            type="time"
            name="time"
            className="form-input"
            value={formData.time}
            onChange={handleInputChange}
            disabled={loading}
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
          />
        </div>
        
        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? getText(language, 'loading') : getText(language, 'register')}
        </button>
        
        <button 
          type="button" 
          onClick={switchLanguage} 
          className="btn btn-secondary btn-small"
        >
          {getText(language, 'switchLanguage')}
        </button>
      </form>
      
      {queueInfo && (
        <div className="mt-20">
          <h3>
            <span className={queueInfo.statusClass}>
              {getText(language, 'yourQueueNumber')}: {queueInfo.queueNumber}, 
              {getText(language, 'position')}: {queueInfo.position}, 
              {getText(language, 'status')}: {queueInfo.status}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
}

export default Patient;
