package com.clinicSys.dto;

import java.math.BigDecimal;

public record DashboardStatsDTO(
    BigDecimal todayRevenue,
    Long patientsToday,
    Long newPatientsThisMonth,
    Long appointmentsBooked,
    Long totalStaff,
    Long totalDoctors,
    Long totalReceptionists,
    Long activeStaff
) {}

