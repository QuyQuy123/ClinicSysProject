package com.clinicSys.service;

import com.clinicSys.dto.response.DoctorDashboardDTO;

public interface IDoctorService {
    /**
     * Gets dashboard data for the current authenticated doctor
     * @return DoctorDashboardDTO containing doctor name, today's appointments, and waiting queue
     */
    DoctorDashboardDTO getDoctorDashboard();
}

