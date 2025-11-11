import apiClient from './api';

/**
 * Get doctor dashboard data
 * @returns {Promise} Doctor dashboard data including appointments and waiting queue
 */
export const getDoctorDashboard = async () => {
    const response = await apiClient.get('/doctor/dashboard');
    return response.data;
};

