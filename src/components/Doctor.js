import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useInterval } from '../hooks/useInterval';
import { getText, getCurrentDate, sortPatientsByTime } from '../utils/helpers';
import { UPDATE_INTERVAL, STATUS_COLORS, DEPARTMENTS, DEPARTMENT_TRANSLATIONS } from '../utils/constants';
import { Calendar, Clock, Users, Settings, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, X } from 'lucide-react';

function Doctor() {
  const { language, switchLanguage } = useLanguageContext();
  const [day, setDay] = useState(getCurrentDate());
  const [patients, setPatients] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('patients');
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    time: '09:00',
    maxPatients: 4
  });
  const [doctorInfo, setDoctorInfo] = useState(null);

  // Load doctor info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('doctorInfo');
    if (stored) {
      setDoctorInfo(JSON.parse(stored));
    }
  }, []);

  const loadPatients = async (silent = false) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  const loadTimeSlots = async (silent = false) => {
    if (!silent) setLoadingSlots(true);
    try {
      const data = await apiService.getTimeSlots({
        day,
        department: doctorInfo?.department
      });
      const sortedSlots = sortPatientsByTime(data.timeSlots || []);
      setTimeSlots(sortedSlots);
    } catch (err) {
      console.error('Failed to load time slots:', err);
    } finally {
      if (!silent) setLoadingSlots(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await apiService.createTimeSlot({
        ...newSlotData,
        day,
        department: doctorInfo?.department
      });
      setShowSlotForm(false);
      await loadTimeSlots();
    } catch (err) {
      setError(err.message || 'Failed to create time slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm(getText(language, 'confirmDeleteSlot'))) return;
    try {
      await apiService.deleteTimeSlot(slotId);
      await loadTimeSlots();
    } catch (err) {
      setError(err.message || 'Failed to delete time slot');
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
        isAvailable: !currentStatus
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
      loadPatients(true);
      loadTimeSlots(true);
    }
  }, UPDATE_INTERVAL);

  const getSlotStatusColor = (slot) => {
    if (!slot.isAvailable) return 'status-closed';
    if (slot.currentBookings >= slot.maxPatients) return 'status-full';
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
              <span className="doctor-department">
                {DEPARTMENT_TRANSLATIONS[language]?.[doctorInfo.department.toLowerCase()] || doctorInfo.department}
              </span>
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

          <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <Users size={18} />
          {getText(language, 'patientRegistration')}
        </button>
        <button
          className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <Clock size={18} />
          {getText(language, 'availableTimeSlots')}
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
                {loading ? getText(language, 'loading') : getText(language, 'loadPatients')}
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
                <h3>{getText(language, 'noPatientsFound')}</h3>
                <p>{getText(language, 'noPatientsScheduled')} {day}</p>
              </motion.div>
            ) : (
              patients.map((patient, index) => (
                <motion.div 
                  key={patient.id} 
                  layout
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
                      <span className="info-label">{getText(language, 'queueNumber')}:</span>
                      <span className="info-value">#{patient.queueNumber}</span>
                    </div>
                    <div className="patient-info">
                      <span className="info-label">{getText(language, 'department')}:</span>
                      <span className="info-value">
                        {DEPARTMENT_TRANSLATIONS[language]?.[patient.department.toLowerCase()] || patient.department}
                      </span>
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
                        {getText(language, 'startConsultation')}
                      </motion.button>
                    )}
                    
                    {patient.status === 'In Progress' && (
                      <motion.button
                        onClick={() => completePatient(patient.id)}
                        className="btn btn-small btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {getText(language, 'complete')}
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
              <h4>{getText(language, 'addNewTimeSlot')}</h4>
              <form onSubmit={handleCreateSlot}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{getText(language, 'time')}</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={newSlotData.time}
                      onChange={(e) => setNewSlotData({...newSlotData, time: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{getText(language, 'maxPatients')}</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newSlotData.maxPatients}
                      onChange={(e) => setNewSlotData({...newSlotData, maxPatients: parseInt(e.target.value)})}
                      min="1" 
                      max="10" 
                      required 
                    />
                  </div>
                </div>
                <motion.button type="submit" className="btn btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {getText(language, 'addSlot')}
                </motion.button>
              </form>
            </motion.div>
          )}

          <div className="slots-grid">
            {loadingSlots ? (
              <div className="loading-slots">
                <div className="loading"></div>
                <p>{getText(language, 'loadingTimeSlots')}</p>
              </div>
            ) : timeSlots.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Clock size={48} />
                <h3>{getText(language, 'noTimeSlotsFound')}</h3>
                <p>{getText(language, 'noTimeSlotsConfigured')} {day}</p>
              </motion.div>
            ) : (
              timeSlots.map((slot, index) => (
                <motion.div 
                  key={slot.id} 
                  layout
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
                      <span className="info-label">{getText(language, 'bookings')}:</span>
                      <span className="info-value">{slot.currentBookings}/{slot.maxPatients}</span>
                    </div>
                  </div>

                  <div className="slot-status">
                    <span className={`status-indicator ${slot.isAvailable ? 'available' : 'unavailable'}`}>
                      {slot.isAvailable ? getText(language, 'open') : getText(language, 'closed')}
                    </span>
                  </div>

                  <div className="slot-actions">
                    <div className="action-buttons-group">
                      <motion.button
                        onClick={() => toggleSlotAvailability(slot.id, slot.isAvailable)}
                        className={`btn btn-small ${slot.isAvailable ? 'btn-warning' : 'btn-success'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {slot.isAvailable ? (
                          <>
                            <ToggleLeft size={14} />
                            {getText(language, 'close')}
                          </>
                        ) : (
                          <>
                            <ToggleRight size={14} />
                            {getText(language, 'open')}
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="btn btn-small btn-danger"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={slot.currentBookings > 0}
                        title={slot.currentBookings > 0 ? getText(language, 'cannotDeleteBookedSlot') : getText(language, 'deleteSlot')}
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
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
