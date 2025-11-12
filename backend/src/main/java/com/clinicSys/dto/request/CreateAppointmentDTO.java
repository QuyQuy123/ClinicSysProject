package com.clinicSys.dto.request;

import java.time.LocalDateTime;

public record CreateAppointmentDTO(
    int patientID,
    int doctorID,
    LocalDateTime dateTime,
    Integer serviceID, // Optional
    String note // Optional
) {}

