package com.clinicSys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PaidBillDetailDTO(
    int billID,
    String invoiceCode,
    String paymentStatus,
    Integer paymentMethodID,
    LocalDateTime dateIssued,
    LocalDateTime datePaid,
    BigDecimal totalAmount,
    int appointmentID,
    LocalDateTime appointmentDateTime,
    String doctorName,
    int patientID,
    String patientCode,
    String patientName,
    LocalDate patientDateOfBirth,
    String patientGender,
    String patientAddress,
    String patientPhone,
    String patientEmail
) {}

