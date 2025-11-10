package com.clinicSys.dto;

import java.math.BigDecimal;

public record MedicineDTO(
    int medicineID,
    String medicineCode,
    String medicineName,
    String medicineGroupName,
    int medicineGroupID,
    String strength,
    String unit,
    BigDecimal price,
    int stock,
    String status
) {}

