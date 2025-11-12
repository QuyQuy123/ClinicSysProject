import apiClient from './api';

/**
 * Get all patients
 * @returns {Promise} List of all patients
 */
export const getAllPatients = async () => {
    const response = await apiClient.get('/receptionist/patients');
    return response.data;
};

/**
 * Get patient by ID
 * @param {number} patientId - Patient ID
 * @returns {Promise} Patient data
 */
export const getPatientById = async (patientId) => {
    const response = await apiClient.get(`/receptionist/patients/${patientId}`);
    return response.data;
};

/**
 * Search patients by name, phone, or patient code
 * @param {string} searchTerm - Search term
 * @returns {Promise} List of matching patients
 */
export const searchPatients = async (searchTerm) => {
    const response = await apiClient.get(`/receptionist/patients/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
};

/**
 * Create a new patient
 * @param {Object} patientData - Patient data including fullName, dateOfBirth, gender, address, phone, email
 * @returns {Promise} Created patient data
 */
export const createPatient = async (patientData) => {
    const response = await apiClient.post('/receptionist/patients', patientData);
    return response.data;
};

/**
 * Update an existing patient
 * @param {number} patientId - Patient ID
 * @param {Object} patientData - Updated patient data
 * @returns {Promise} Updated patient data
 */
export const updatePatient = async (patientId, patientData) => {
    const response = await apiClient.put(`/receptionist/patients/${patientId}`, patientData);
    return response.data;
};

