package com.clinicSys.dto;

import java.math.BigDecimal;

public record UpdateMedicineDTO(
    String medicineName,
    Integer medicineGroupID,
    String strength,
    String unit,
    BigDecimal price,
    String status
) {}

