import apiClient from './api';

/**
 * Get EMR data by appointment ID (re-export from emrService)
 */
export const getEMRByAppointmentID = async (appointmentID) => {
    const response = await apiClient.get(`/doctor/emr/appointment/${appointmentID}`);
    return response.data;
};

/**
 * Search medicines by name
 * @param {string} searchTerm Search term
 * @returns {Promise} List of medicines
 */
export const searchMedicines = async (searchTerm) => {
    const response = await apiClient.get(`/doctor/prescription/medicines/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
};

/**
 * Get prescription by appointment ID
 * @param {number} appointmentID Appointment ID
 * @returns {Promise} Prescription data
 */
export const getPrescriptionByAppointmentID = async (appointmentID) => {
    const response = await apiClient.get(`/doctor/prescription/appointment/${appointmentID}`);
    return response.data;
};

/**
 * Save prescription
 * @param {Object} prescriptionData Prescription data
 * @returns {Promise} Saved prescription data
 */
export const savePrescription = async (prescriptionData) => {
    const response = await apiClient.post('/doctor/prescription/save', prescriptionData);
    return response.data;
};

