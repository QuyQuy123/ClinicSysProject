package com.clinicSys.dto.response;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for Electronic Medical Record
 */
public record EMRDTO(
    int patientID,
    String patientCode,
    String patientName,
    LocalDate dateOfBirth,
    int age,
    String gender,
    List<VisitHistoryDTO> visitHistory
) {}

