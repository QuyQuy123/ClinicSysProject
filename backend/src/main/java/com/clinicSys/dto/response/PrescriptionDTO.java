package com.clinicSys.dto.response;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Prescription with items
 */
public record PrescriptionDTO(
    int prescriptionID,
    String prescriptionCode,
    LocalDateTime date,
    String notes,
    String aiAlerts,
    int recordID,
    List<PrescriptionItemDTO> items
) {}

