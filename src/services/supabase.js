import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email,
        password,
        ...metadata
      }
    }
  });
  
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return { user };
};

// Database helper functions
export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');
  
  return { data, error };
};

export const getDoctors = async (filters = {}) => {
  let query = supabase
    .from('doctors')
    .select(`
      *,
      departments (
        id,
        name,
        description
      )
    `)
    .eq('is_active', true);

  if (filters.department_id) {
    query = query.eq('department_id', filters.department_id);
  }

  const { data, error } = await query.order('name');
  return { data, error };
};

export const getTimeSlots = async (filters = {}) => {
  let query = supabase
    .from('time_slots')
    .select(`
      *,
      departments (
        id,
        name,
        description
      )
    `);

  if (filters.day) {
    query = query.eq('day', filters.day);
  }
  
  if (filters.department_id) {
    query = query.eq('department_id', filters.department_id);
  }

  if (filters.is_available !== undefined) {
    query = query.eq('is_available', filters.is_available);
  }

  const { data, error } = await query.order('time');
  return { data, error };
};

export const createTimeSlot = async (slotData) => {
  const { data, error } = await supabase
    .from('time_slots')
    .insert([slotData])
    .select()
    .single();
  
  return { data, error };
};

export const updateTimeSlot = async (id, slotData) => {
  const { data, error } = await supabase
    .from('time_slots')
    .update(slotData)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteTimeSlot = async (id) => {
  const { error } = await supabase
    .from('time_slots')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const getPatients = async (filters = {}) => {
  let query = supabase
    .from('patients')
    .select(`
      *,
      departments (
        id,
        name,
        description
      ),
      time_slots (
        id,
        time,
        day,
        is_available,
        max_patients,
        current_bookings
      )
    `);

  if (filters.day) {
    query = query.eq('day', filters.day);
  }
  
  if (filters.department_id) {
    query = query.eq('department_id', filters.department_id);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query
    .order('queue_number')
    .order('time');
  
  return { data, error };
};

export const createPatient = async (patientData) => {
  // Start a transaction to handle patient creation and time slot update
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (patientError) {
    return { data: null, error: patientError };
  }

  // Update time slot booking count
  const { data: timeSlot, error: slotError } = await supabase
    .from('time_slots')
    .update({
      current_bookings: patientData.time_slot?.current_bookings + 1,
      is_available: patientData.time_slot?.current_bookings + 1 >= patientData.time_slot?.max_patients
    })
    .eq('id', patientData.time_slot_id)
    .select()
    .single();

  if (slotError) {
    return { data: null, error: slotError };
  }

  return { data: { ...patient, time_slot: timeSlot }, error: null };
};

export const updatePatient = async (id, patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .update(patientData)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const getDoctorAppointments = async (doctorId, filters = {}) => {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      patients (
        id,
        name,
        phone,
        email
      ),
      time_slots (
        id,
        time,
        day,
        departments (
          id,
          name,
          description
        )
      )
    `)
    .eq('doctor_id', doctorId);

  if (filters.day) {
    query = query.eq('day', filters.day);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('time');
  return { data, error };
};

export const createAppointment = async (appointmentData) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();
  
  return { data, error };
};

export const updateAppointment = async (id, appointmentData) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(appointmentData)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

// Real-time subscriptions
export const subscribeToTimeSlots = (callback, filters = {}) => {
  let subscription = supabase
    .channel('public')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'time_slots',
      filter: filters 
    }, callback);

  return subscription;
};

export const subscribeToPatients = (callback, filters = {}) => {
  let subscription = supabase
    .channel('public')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'patients',
      filter: filters 
    }, callback);

  return subscription;
};

export const subscribeToAppointments = (callback, filters = {}) => {
  let subscription = supabase
    .channel('public')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'appointments',
      filter: filters 
    }, callback);

  return subscription;
};
