package com.clinicSys.dto.response;

import java.math.BigDecimal;

public record BillingPrescriptionItemDTO(
    int medicineID,
    String medicineName,
    String medicineCode,
    String strength,
    String unit,
    BigDecimal unitPrice,
    int quantity,
    BigDecimal lineTotal,
    String note
) {}

