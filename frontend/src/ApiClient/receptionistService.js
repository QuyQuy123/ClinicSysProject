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

