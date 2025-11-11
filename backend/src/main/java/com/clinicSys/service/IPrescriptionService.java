package com.clinicSys.service;

import com.clinicSys.dto.request.SavePrescriptionDTO;
import com.clinicSys.dto.response.MedicineDTO;
import com.clinicSys.dto.response.PrescriptionDTO;

import java.util.List;

public interface IPrescriptionService {
    /**
     * Search medicines by name (case-insensitive)
     * @param searchTerm Search term
     * @return List of matching medicines
     */
    List<MedicineDTO> searchMedicines(String searchTerm);
    
    /**
     * Gets prescription data by appointment ID
     * @param appointmentID Appointment ID
     * @return PrescriptionDTO containing prescription and items
     */
    PrescriptionDTO getPrescriptionByAppointmentID(int appointmentID);
    
    /**
     * Saves or updates prescription
     * @param saveDTO Prescription data
     * @return PrescriptionDTO
     */
    PrescriptionDTO savePrescription(SavePrescriptionDTO saveDTO);
}

