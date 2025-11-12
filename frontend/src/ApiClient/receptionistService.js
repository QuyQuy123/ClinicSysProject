import apiClient from './api';

/**
 * Get receptionist dashboard data
 * @returns {Promise} Receptionist dashboard data including statistics, appointments and live queue
 */
export const getReceptionistDashboard = async () => {
    const response = await apiClient.get('/receptionist/dashboard');
    return response.data;
};

