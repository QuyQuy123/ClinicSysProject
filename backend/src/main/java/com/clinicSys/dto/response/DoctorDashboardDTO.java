package com.clinicSys.dto.response;

import java.util.List;

/**
 * DTO for Doctor Dashboard data
 */
public record DoctorDashboardDTO(
    String doctorName,
    List<AppointmentDTO> todayAppointments,  // Scheduled and Checked-in
    List<AppointmentDTO> waitingQueue        // Checked-in patients (shown as waiting)
) {}

