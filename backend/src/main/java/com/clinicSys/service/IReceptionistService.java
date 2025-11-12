package com.clinicSys.service;

import java.time.LocalDate;
import java.util.List;

import com.clinicSys.dto.request.CreateAppointmentDTO;
import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.AppointmentWithDoctorDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.dto.response.ServiceDTO;
import com.clinicSys.dto.response.UserDTO;

public interface IReceptionistService {
    ReceptionistDashboardDTO getDashboard();
    List<AppointmentWithDoctorDTO> getAppointmentsByWeek(LocalDate weekStart);
    AppointmentDetailsDTO getAppointmentById(int appointmentId);
    AppointmentDetailsDTO updateAppointmentStatus(int appointmentId, String newStatus);
    List<PatientDTO> searchPatientsByName(String name);
    List<UserDTO> getAllDoctors();
    List<ServiceDTO> getAllServices();
    AppointmentWithDoctorDTO createAppointment(CreateAppointmentDTO createAppointmentDTO);
}

