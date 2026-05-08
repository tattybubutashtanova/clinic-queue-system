import { TEXT_TRANSLATIONS } from './constants';

// Language utilities
export const getNextLanguage = (currentLang) => {
  const languages = ['en', 'ru', 'kg'];
  const currentIndex = languages.indexOf(currentLang);
  return languages[(currentIndex + 1) % languages.length];
};

// Translation utility
export const getText = (lang, key) => {
  return TEXT_TRANSLATIONS[lang]?.[key] || TEXT_TRANSLATIONS.en[key] || key;
};

// Date utilities
export const getKGTime = () => {
  // Kyrgyzstan is UTC+6
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 6));
};

export const getCurrentDate = () => {
  return getKGTime().toISOString().slice(0, 10);
};

export const isTimeSlotPast = (slotDate, slotTime) => {
  const kgNow = getKGTime();
  const today = kgNow.toISOString().slice(0, 10);
  
  // If slot is for a future day, it's not past
  if (slotDate > today) return false;
  // If slot is for a past day, it is past
  if (slotDate < today) return true;
  
  // If same day, compare HH:MM
  const currentHHMM = kgNow.toTimeString().slice(0, 5);
  return slotTime < currentHHMM;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Queue utilities
export const calculateQueuePosition = (patients, currentPatient) => {
  if (!currentPatient) return 0;
  
  return patients.filter(p => 
    p.department === currentPatient.department && 
    (p.status === "Waiting" || p.status === "In Progress") && 
    p.queueNumber <= currentPatient.queueNumber
  ).length;
};

// Form validation
export const validatePatientForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.time) {
    errors.time = 'Time is required';
  }
  
  if (!formData.day) {
    errors.day = 'Day is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!formData.password?.trim()) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sorting utilities
export const sortPatientsByTime = (patients) => {
  return [...patients].sort((a, b) => a.time.localeCompare(b.time));
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};
