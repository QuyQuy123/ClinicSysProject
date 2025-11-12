package com.clinicSys.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Appointment with full patient and doctor details
 */
public record AppointmentDetailsDTO(
    int appointmentID,
    LocalDateTime dateTime,
    String status,
    int patientID,
    String patientCode,
    String patientName,
    LocalDate patientDateOfBirth,
    String patientGender,
    String patientAddress,
    String patientPhone,
    String patientEmail,
    int doctorID,
    String doctorName,
    int receptionistID
) {}

