package com.clinicSys.repository;

import com.clinicSys.domain.Appointment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Appointment entity operations.
 * Follows the repository pattern as specified in the UML diagram.
 */
public interface IAppointmentRepository {
    
    /**
     * Finds an appointment by ID
     * @param id Appointment ID
     * @return Optional containing the appointment if found, empty otherwise
     */
    Optional<Appointment> findById(int id);
    
    /**
     * Saves or updates an appointment entity
     * @param appointment Appointment entity to save
     * @return Saved appointment entity
     */
    Appointment save(Appointment appointment);
    
    /**
     * Finds all appointments between two dates
     * @param start Start date
     * @param end End date
     * @return List of appointments in the date range
     */
    List<Appointment> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Counts appointments by date range
     * @param startDate Start date
     * @param endDate End date
     * @return Count of appointments
     */
    Long countByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Finds all appointments for a specific doctor on a specific date
     * @param doctorID Doctor ID
     * @param start Start of the day
     * @param end End of the day
     * @return List of appointments
     */
    List<Appointment> findByDoctorIDAndDateRange(int doctorID, LocalDateTime start, LocalDateTime end);
    
    /**
     * Finds appointments by doctor ID and status
     * @param doctorID Doctor ID
     * @param status Appointment status
     * @return List of appointments
     */
    List<Appointment> findByDoctorIDAndStatus(int doctorID, String status);
}

