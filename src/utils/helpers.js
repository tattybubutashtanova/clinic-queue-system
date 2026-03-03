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
export const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10);
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
