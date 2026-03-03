import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, sortPatientsByTime } from '../utils/helpers';
import { UPDATE_INTERVAL, STATUS_COLORS } from '../utils/constants';

function Doctor() {
  const { language, switchLanguage } = useLanguage();
  const [day, setDay] = useState(getCurrentDate());
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPatients = async () => {
    setLoading(true);
    setError('');
    
    try {
      const patientsData = await apiService.getPatients(day);
      const sortedPatients = sortPatientsByTime(patientsData);
      setPatients(sortedPatients);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const callNext = async () => {
    try {
      await apiService.callNextPatient(day);
      await loadPatients(); // Reload patients after calling next
    } catch (err) {
      setError(err.message || 'Failed to call next patient');
    }
  };

  useEffect(() => {
    loadPatients();
  }, [day]);

  useInterval(loadPatients, UPDATE_INTERVAL);

  return (
    <div className="container">
      <h2>{getText(language, 'doctorDashboardTitle')}</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">
          {getText(language, 'day')}
        </label>
        <input
          type="date"
          className="form-input"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
      </div>
      
      <div className="mb-20">
        <button 
          onClick={loadPatients} 
          className="btn"
          disabled={loading}
        >
          {loading ? getText(language, 'loading') : getText(language, 'loadPatients')}
        </button>
        
        <button 
          onClick={callNext} 
          className="btn"
          disabled={loading}
        >
          {getText(language, 'callNext')}
        </button>
        
        <button 
          onClick={switchLanguage} 
          className="btn btn-secondary btn-small"
        >
          {getText(language, 'switchLanguage')}
        </button>
      </div>
      
      <div>
        {patients.length === 0 ? (
          <p>No patients found for this day.</p>
        ) : (
          patients.map(patient => (
            <div 
              key={patient.id} 
              className={`card ${STATUS_COLORS[patient.status] || ''}`}
            >
              <strong>{patient.name}</strong><br />
              {getText(language, 'department')}: {patient.department}<br />
              {getText(language, 'time')}: {patient.time}<br />
              {getText(language, 'yourQueueNumber')}: {patient.queueNumber}<br />
              {getText(language, 'status')}: {patient.status}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Doctor;
