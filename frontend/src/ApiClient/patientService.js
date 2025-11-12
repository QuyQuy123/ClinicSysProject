import apiClient from './api';

/**
 * Create a new patient
 * @param {Object} patientData - Patient data including fullName, dateOfBirth, gender, address, phone, email
 * @returns {Promise} Created patient data
 */
export const createPatient = async (patientData) => {
    const response = await apiClient.post('/receptionist/patients', patientData);
    return response.data;
};

