package com.clinicSys.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for Receptionist Dashboard data
 */
public record ReceptionistDashboardDTO(
    // Statistics
    long appointmentsToday,
    long totalSlotsToday,
    long patientsCheckedIn,
    long patientsWaiting,
    BigDecimal estimatedRevenue,
    
    // Today's Appointments (Scheduled, Checked-in, In Consultation, Completed)
    List<AppointmentWithDoctorDTO> todayAppointments,
    
    // Live Patient Queue (Waiting, In Consultation, Ready for Billing)
    List<AppointmentWithDoctorDTO> liveQueue
) {}

