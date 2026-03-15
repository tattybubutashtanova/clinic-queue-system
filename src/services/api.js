const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Authentication endpoints
  async loginDoctor(credentials) {
    const data = await this.request('/api/login-doctor', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  // Time slot endpoints
  async getTimeSlots(filters = {}) {
    const params = new URLSearchParams();
    if (filters.day) params.append('day', filters.day);
    if (filters.department) params.append('department', filters.department);
    
    const query = params.toString();
    return this.request(`/api/timeslots${query ? `?${query}` : ''}`);
  }

  async createTimeSlot(slotData) {
    return this.request('/api/timeslots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async updateTimeSlot(id, slotData) {
    return this.request(`/api/timeslots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slotData),
    });
  }

  async deleteTimeSlot(id) {
    return this.request(`/api/timeslots/${id}`, {
      method: 'DELETE',
    });
  }

  // Department endpoints
  async getDepartments() {
    return this.request('/api/departments');
  }

  // Patient endpoints
  async registerPatient(patientData) {
    return this.request('/api/register-patient', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async getPatients(filters = {}) {
    const params = new URLSearchParams();
    if (filters.day) params.append('day', filters.day);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    
    const query = params.toString();
    return this.request(`/api/patients${query ? `?${query}` : ''}`);
  }

  async getPatient(id) {
    return this.request(`/api/patients/${id}`);
  }

  async updatePatient(id, patientData) {
    return this.request(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  // Queue management endpoints
  async callNextPatient(options = {}) {
    return this.request('/api/call-next', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async completePatient(id) {
    return this.request(`/api/complete-patient/${id}`, {
      method: 'POST',
    });
  }

  // Statistics endpoints
  async getStats(filters = {}) {
    const params = new URLSearchParams();
    if (filters.day) params.append('day', filters.day);
    
    const query = params.toString();
    return this.request(`/api/stats${query ? `?${query}` : ''}`);
  }

  // Legacy methods for backward compatibility
  async loginDoctorLegacy(credentials) {
    const result = await this.loginDoctor(credentials);
    return result;
  }

  async registerPatientLegacy(patientData) {
    const result = await this.registerPatient(patientData);
    return {
      success: result.success,
      id: result.patient?.id,
      queueNumber: result.patient?.queueNumber,
      position: result.patient?.position
    };
  }

  async getPatientsLegacy(day) {
    const result = await this.getPatients({ day });
    return result.patients || [];
  }

  async callNextPatientLegacy(day) {
    const result = await this.callNextPatient({ day });
    return { success: result.success };
  }
}

export default new ApiService();
