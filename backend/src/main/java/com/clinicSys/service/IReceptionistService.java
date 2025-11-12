package com.clinicSys.service;

import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.AppointmentWithDoctorDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;

import java.time.LocalDate;
import java.util.List;

public interface IReceptionistService {
    ReceptionistDashboardDTO getDashboard();
    List<AppointmentWithDoctorDTO> getAppointmentsByWeek(LocalDate weekStart);
    AppointmentDetailsDTO getAppointmentById(int appointmentId);
    AppointmentDetailsDTO updateAppointmentStatus(int appointmentId, String newStatus);
}

