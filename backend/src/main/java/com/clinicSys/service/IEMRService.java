package com.clinicSys.service;

import com.clinicSys.dto.request.SaveConsultationDTO;
import com.clinicSys.dto.response.ConsultationDataDTO;
import com.clinicSys.dto.response.EMRDTO;
import com.clinicSys.dto.response.ICD10CodeDTO;

import java.util.List;

public interface IEMRService {
    /**
     * Gets EMR data for a patient by appointment ID
     * @param appointmentID Appointment ID
     * @return EMRDTO containing patient info and visit history
     */
    EMRDTO getEMRByAppointmentID(int appointmentID);
    
    /**
     * Updates appointment status to "In Consultation"
     * @param appointmentID Appointment ID
     */
    void startConsultation(int appointmentID);
    
    /**
     * Completes consultation (updates appointment status to "Completed")
     * @param appointmentID Appointment ID
     */
    void completeConsultation(int appointmentID);
    
    /**
     * Search ICD10 codes by code or description (case-insensitive)
     * @param searchTerm Search term
     * @return List of matching ICD10 codes
     */
    List<ICD10CodeDTO> searchICD10Codes(String searchTerm);
    
    /**
     * Saves consultation note (MedicalRecord and optionally Diagnosis)
     * @param saveDTO Consultation data
     */
    void saveConsultation(SaveConsultationDTO saveDTO);
    
    /**
     * Gets consultation data for editing (MedicalRecord + Diagnosis)
     * @param appointmentID Appointment ID
     * @return ConsultationDataDTO containing current consultation data
     */
    ConsultationDataDTO getConsultationData(int appointmentID);
}

