import apiClient from './api';

/**
 * Get receptionist dashboard data
 * @returns {Promise} Receptionist dashboard data including statistics, appointments and live queue
 */
export const getReceptionistDashboard = async () => {
    const response = await apiClient.get('/receptionist/dashboard');
    return response.data;
};

/**
 * Get appointments by week
 * @param {string} weekStart - Start date of the week (YYYY-MM-DD)
 * @returns {Promise} List of appointments for the week
 */
export const getAppointmentsByWeek = async (weekStart) => {
    const response = await apiClient.get(`/receptionist/appointments/week?weekStart=${weekStart}`);
    return response.data;
};

/**
 * Get appointment details by ID
 * @param {number} appointmentId - Appointment ID
 * @returns {Promise} Appointment details
 */
export const getAppointmentById = async (appointmentId) => {
    const response = await apiClient.get(`/receptionist/appointments/${appointmentId}`);
    return response.data;
};

/**
 * Update appointment status
 * @param {number} appointmentId - Appointment ID
 * @param {string} status - New status
 * @returns {Promise} Updated appointment details
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
    const response = await apiClient.put(`/receptionist/appointments/${appointmentId}/status`, { status });
    return response.data;
};

/**
 * Search patients by name
 * @param {string} name - Patient name to search
 * @returns {Promise} List of matching patients
 */
export const searchPatientsByName = async (name) => {
    const response = await apiClient.get(`/receptionist/appointments/patients/search?name=${encodeURIComponent(name)}`);
    return response.data;
};

/**
 * Get all doctors
 * @returns {Promise} List of all doctors
 */
export const getAllDoctors = async () => {
    const response = await apiClient.get('/receptionist/doctors');
    return response.data;
};

/**
 * Get all services
 * @returns {Promise} List of all services
 */
export const getAllServices = async () => {
    const response = await apiClient.get('/receptionist/services');
    return response.data;
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data (patientID, doctorID, dateTime, serviceID?, note?)
 * @returns {Promise} Created appointment
 */
export const createAppointment = async (appointmentData) => {
    const response = await apiClient.post('/receptionist/appointments', appointmentData);
    return response.data;
};

