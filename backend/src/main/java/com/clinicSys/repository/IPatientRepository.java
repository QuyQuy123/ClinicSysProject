package com.clinicSys.repository;

import com.clinicSys.domain.Patient;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Patient entity operations.
 * Follows the repository pattern as specified in the UML diagram.
 */
public interface IPatientRepository {
    
    /**
     * Finds a patient by ID
     * @param id Patient ID
     * @return Optional containing the patient if found, empty otherwise
     */
    Optional<Patient> findById(int id);
    
    /**
     * Saves or updates a patient entity
     * @param patient Patient entity to save
     * @return Saved patient entity
     */
    Patient save(Patient patient);
    
    /**
     * Retrieves all patients
     * @return List of all patients
     */
    List<Patient> findAll();
    
    /**
     * Finds a patient by phone number
     * @param phone Phone number to search for
     * @return Optional containing the patient if found, empty otherwise
     */
    Optional<Patient> findByPhone(String phone);
    
    /**
     * Counts distinct patients by date range (from appointments)
     * @param startDate Start date
     * @param endDate End date
     * @return Count of distinct patients
     */
    Long countDistinctPatientsByDateRange(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
    
    /**
     * Counts new patients by date range (patients with first appointment in range)
     * @param startDate Start date
     * @param endDate End date
     * @return Count of new patients
     */
    Long countNewPatientsByDateRange(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
    
    /**
     * Searches patients by name, phone, or patient code
     * @param searchTerm Search term to match against name, phone, or patient code
     * @return List of matching patients
     */
    List<Patient> searchPatients(String searchTerm);
}

