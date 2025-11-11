import apiClient from './api';

/**
 * Get EMR data by appointment ID
 * @param {number} appointmentID Appointment ID
 * @returns {Promise} EMR data including patient info and visit history
 */
export const getEMRByAppointmentID = async (appointmentID) => {
    const response = await apiClient.get(`/doctor/emr/appointment/${appointmentID}`);
    return response.data;
};

/**
 * Start consultation (update appointment status to "In Consultation")
 * @param {number} appointmentID Appointment ID
 * @returns {Promise}
 */
export const startConsultation = async (appointmentID) => {
    const response = await apiClient.post(`/doctor/emr/appointment/${appointmentID}/start-consultation`);
    return response.data;
};

/**
 * Search ICD10 codes
 * @param {string} searchTerm Search term
 * @returns {Promise} List of ICD10 codes
 */
export const searchICD10Codes = async (searchTerm) => {
    const response = await apiClient.get(`/doctor/emr/icd10/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
};

/**
 * Get consultation data for editing
 * @param {number} appointmentID Appointment ID
 * @returns {Promise} Consultation data
 */
export const getConsultationData = async (appointmentID) => {
    const response = await apiClient.get(`/doctor/emr/consultation/${appointmentID}`);
    return response.data;
};

/**
 * Save consultation note
 * @param {Object} consultationData Consultation data
 * @returns {Promise}
 */
export const saveConsultation = async (consultationData) => {
    const response = await apiClient.post('/doctor/emr/consultation/save', consultationData);
    return response.data;
};

