package com.clinicSys.dto.response;

import java.time.LocalDateTime;

/**
 * DTO for Appointment with patient information
 */
public record AppointmentDTO(
    int appointmentID,
    LocalDateTime dateTime,
    String status,
    int patientID,
    String patientName,
    String patientCode,
    int doctorID,
    int receptionistID
) {}

