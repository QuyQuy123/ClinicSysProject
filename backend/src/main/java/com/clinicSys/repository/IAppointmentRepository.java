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
}

