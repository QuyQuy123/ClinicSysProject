package com.clinicSys.dto.response;

/**
 * DTO for consultation data (for viewing/editing)
 */
public record ConsultationDataDTO(
    int appointmentID,
    String vitals,
    String symptoms,
    String notes,
    Integer icd10CodeID,
    String icd10Code,
    String icd10Description
) {}

