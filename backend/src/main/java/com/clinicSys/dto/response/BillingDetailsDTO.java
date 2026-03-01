package com.clinicSys.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record BillingDetailsDTO(
    int appointmentID,
    String paymentStatus,
    String invoiceCode,
    int patientID,
    String patientName,
    int doctorID,
    String doctorName,
    String diagnosisCode,
    String diagnosisDescription,
    String symptoms,
    String consultationNotes,
    List<BillingPrescriptionItemDTO> items,
    BigDecimal totalAmount
) {}

