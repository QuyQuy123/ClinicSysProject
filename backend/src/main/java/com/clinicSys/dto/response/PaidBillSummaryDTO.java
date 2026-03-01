package com.clinicSys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaidBillSummaryDTO(
    int billID,
    String invoiceCode,
    int appointmentID,
    LocalDateTime dateIssued,
    LocalDateTime datePaid,
    BigDecimal totalAmount,
    int patientID,
    String patientCode,
    String patientName
) {}

