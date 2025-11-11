package com.clinicSys.dto.response;

import java.time.LocalDateTime;

/**
 * DTO for visit history in EMR
 */
public record VisitHistoryDTO(
    int appointmentID,
    LocalDateTime visitDate,
    String reasonForVisit,  // From MedicalRecord.Symptoms
    String primaryDiagnosis, // From Diagnosis.Description
    String diagnosisCode,    // From ICD10Code.Code
    String doctorName,
    int recordID            // MedicalRecord ID to track insertion order (newest = highest ID)
) {}

