package com.clinicSys.dto;

import java.math.BigDecimal;

public record CreateMedicineDTO(
    String medicineCode,
    int medicineGroupID,
    String medicineName,
    String strength,
    String unit,
    BigDecimal price,
    int stock,
    String status
) {}

