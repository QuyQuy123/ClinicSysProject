package com.clinicSys.dto.response;

/**
 * DTO for prescription medicine item
 */
public record PrescriptionItemDTO(
    int prescriptionMedicineID,
    int medicineID,
    String medicineName,
    String medicineCode,
    String strength,
    int quantity,
    String note
) {}

