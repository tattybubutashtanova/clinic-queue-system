import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, sortPatientsByTime } from '../utils/helpers';
import { UPDATE_INTERVAL, STATUS_COLORS, DEPARTMENTS } from '../utils/constants';
import { Calendar, Clock, Users, Settings, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from 'lucide-react';

function Doctor() {
  const { language, switchLanguage } = useLanguage();
  const [day, setDay] = useState(getCurrentDate());
  const [patients, setPatients] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('patients');
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  // Load doctor info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('doctorInfo');
    if (stored) {
      setDoctorInfo(JSON.parse(stored));
    }
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError('');
    
    try {
      const patientsData = await apiService.getPatients({
        day,
        department: doctorInfo?.department
      });
      const sortedPatients = sortPatientsByTime(patientsData.patients || []);
      setPatients(sortedPatients);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const data = await apiService.getTimeSlots({
        day,
        department: doctorInfo?.department
      });
      setTimeSlots(data.timeSlots || []);
    } catch (err) {
      console.error('Failed to load time slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const callNext = async () => {
    try {
      await apiService.callNextPatient({
        day,
        department: doctorInfo?.department
      });
      await loadPatients(); // Reload patients after calling next
    } catch (err) {
      setError(err.message || 'Failed to call next patient');
    }
  };

  const toggleSlotAvailability = async (slotId, currentStatus) => {
    try {
      await apiService.updateTimeSlot(slotId, {
        is_available: !currentStatus
      });
      await loadTimeSlots(); // Reload slots after update
    } catch (err) {
      setError(err.message || 'Failed to update time slot');
    }
  };

  const completePatient = async (patientId) => {
    try {
      await apiService.updatePatient(patientId, {
        status: 'Completed'
      });
      await loadPatients(); // Reload patients after completion
    } catch (err) {
      setError(err.message || 'Failed to complete patient');
    }
  };

  const startPatient = async (patientId) => {
    try {
      await apiService.updatePatient(patientId, {
        status: 'In Progress'
      });
      await loadPatients(); // Reload patients after starting
    } catch (err) {
      setError(err.message || 'Failed to start patient consultation');
    }
  };

  useEffect(() => {
    if (doctorInfo) {
      loadPatients();
      loadTimeSlots();
    }
  }, [day, doctorInfo]);

  useInterval(() => {
    if (doctorInfo) {
      loadPatients();
      loadTimeSlots();
    }
  }, UPDATE_INTERVAL);

  const getSlotStatusColor = (slot) => {
    if (!slot.is_available) return 'status-closed';
    if (slot.current_bookings >= slot.max_patients) return 'status-full';
    return 'status-open';
  };

  const getPatientStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return 'patient-waiting';
      case 'In Progress': return 'patient-progress';
      case 'Completed': return 'patient-completed';
      default: return '';
    }
  };

  return (
    <div className="container">
      {/* Doctor Header */}
      <motion.div 
        className="doctor-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="doctor-info">
          <h2>{getText(language, 'doctorDashboardTitle')}</h2>
          {doctorInfo && (
            <div className="doctor-details">
              <span className="doctor-name">{doctorInfo.name}</span>
              <span className="doctor-department">{doctorInfo.department}</span>
            </div>
          )}
        </div>
        
        <div className="doctor-actions">
          <motion.button
            onClick={switchLanguage}
            className="btn btn-secondary btn-small"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language.toUpperCase()}
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          className="alert alert-error"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <Users size={18} />
          Patient Queue
        </button>
        <button
          className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <Clock size={18} />
          Time Slots
        </button>
      </div>

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <motion.div 
          className="tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="controls-section">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
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
            
            <div className="action-buttons">
              <motion.button 
                onClick={loadPatients} 
                className="btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? getText(language, 'loading') : 'Refresh Patients'}
              </motion.button>
              
              <motion.button 
                onClick={callNext} 
                className="btn btn-primary"
                disabled={loading || patients.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {getText(language, 'callNext')}
              </motion.button>
            </div>
          </div>

          <div className="patients-grid">
            {patients.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Users size={48} />
                <h3>No Patients Found</h3>
                <p>No patients scheduled for {day}</p>
              </motion.div>
            ) : (
              patients.map((patient, index) => (
                <motion.div 
                  key={patient.id} 
                  className={`patient-card ${getPatientStatusColor(patient.status)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="patient-header">
                    <strong className="patient-name">{patient.name}</strong>
                    <span className="patient-time">{patient.time}</span>
                  </div>
                  
                  <div className="patient-details">
                    <div className="patient-info">
                      <span className="info-label">Queue:</span>
                      <span className="info-value">#{patient.queueNumber}</span>
                    </div>
                    <div className="patient-info">
                      <span className="info-label">Department:</span>
                      <span className="info-value">{patient.department}</span>
                    </div>
                  </div>

                  <div className="patient-status">
                    <span className="status-badge">{patient.status}</span>
                  </div>

                  <div className="patient-actions">
                    {patient.status === 'Waiting' && (
                      <motion.button
                        onClick={() => startPatient(patient.id)}
                        className="btn btn-small btn-success"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Consultation
                      </motion.button>
                    )}
                    
                    {patient.status === 'In Progress' && (
                      <motion.button
                        onClick={() => completePatient(patient.id)}
                        className="btn btn-small btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Complete
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Time Slots Tab */}
      {activeTab === 'slots' && (
        <motion.div 
          className="tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="controls-section">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
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
            
            <div className="action-buttons">
              <motion.button
                onClick={() => setShowSlotForm(!showSlotForm)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                {showSlotForm ? 'Hide Form' : 'Add Time Slot'}
              </motion.button>
            </div>
          </div>

          {/* Time Slot Form */}
          {showSlotForm && (
            <motion.div 
              className="slot-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h4>Add New Time Slot</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Patients</label>
                  <input type="number" className="form-input" defaultValue="4" min="1" max="10" />
                </div>
              </div>
              <motion.button className="btn btn-primary">Add Slot</motion.button>
            </motion.div>
          )}

          <div className="slots-grid">
            {loadingSlots ? (
              <div className="loading-slots">
                <div className="loading"></div>
                <p>Loading time slots...</p>
              </div>
            ) : timeSlots.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Clock size={48} />
                <h3>No Time Slots Found</h3>
                <p>No time slots configured for {day}</p>
              </motion.div>
            ) : (
              timeSlots.map((slot, index) => (
                <motion.div 
                  key={slot.id} 
                  className={`slot-card ${getSlotStatusColor(slot)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="slot-header">
                    <Clock size={16} />
                    <span className="slot-time">{slot.time}</span>
                  </div>
                  
                  <div className="slot-details">
                    <div className="slot-info">
                      <span className="info-label">Bookings:</span>
                      <span className="info-value">{slot.current_bookings}/{slot.max_patients}</span>
                    </div>
                  </div>

                  <div className="slot-status">
                    <span className={`status-indicator ${slot.is_available ? 'available' : 'unavailable'}`}>
                      {slot.is_available ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  <div className="slot-actions">
                    <motion.button
                      onClick={() => toggleSlotAvailability(slot.id, slot.is_available)}
                      className={`btn btn-small ${slot.is_available ? 'btn-warning' : 'btn-success'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {slot.is_available ? (
                        <>
                          <ToggleLeft size={14} />
                          Close
                        </>
                      ) : (
                        <>
                          <ToggleRight size={14} />
                          Open
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Doctor;
