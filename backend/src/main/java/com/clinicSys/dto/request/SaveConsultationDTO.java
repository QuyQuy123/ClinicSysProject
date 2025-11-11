package com.clinicSys.dto.request;

/**
 * DTO for saving consultation note
 */
public record SaveConsultationDTO(
    int appointmentID,
    String vitals,
    String symptoms,
    String notes,
    Integer icd10CodeID  // Optional - can be null
) {}

