package com.clinicSys.dto.request;

import java.util.List;

/**
 * DTO for saving prescription
 */
public record SavePrescriptionDTO(
    int appointmentID,
    String notes,
    String aiAlerts,
    List<PrescriptionItemRequestDTO> items
) {
    public record PrescriptionItemRequestDTO(
        int medicineID,
        int quantity,
        String note
    ) {}
}

