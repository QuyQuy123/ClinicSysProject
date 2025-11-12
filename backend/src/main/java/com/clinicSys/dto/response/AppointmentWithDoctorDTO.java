package com.clinicSys.dto.response;

import java.time.LocalDateTime;

/**
 * DTO for Appointment with patient and doctor information for receptionist dashboard
 */
public record AppointmentWithDoctorDTO(
    int appointmentID,
    LocalDateTime dateTime,
    String status,
    int patientID,
    String patientName,
    int doctorID,
    String doctorName
) {}

