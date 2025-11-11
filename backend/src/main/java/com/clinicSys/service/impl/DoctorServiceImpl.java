package com.clinicSys.service.impl;

import com.clinicSys.domain.Appointment;
import com.clinicSys.domain.Patient;
import com.clinicSys.domain.User;
import com.clinicSys.dto.response.AppointmentDTO;
import com.clinicSys.dto.response.DoctorDashboardDTO;
import com.clinicSys.repository.IAppointmentRepository;
import com.clinicSys.repository.IPatientRepository;
import com.clinicSys.service.IDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements IDoctorService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Override
    public DoctorDashboardDTO getDoctorDashboard() {
        // Get current authenticated doctor
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.");
        }
        
        User currentUser = (User) authentication.getPrincipal();
        int doctorID = currentUser.getUserID();
        String doctorName = currentUser.getFullName() != null && !currentUser.getFullName().isEmpty() 
            ? currentUser.getFullName() 
            : currentUser.getUsername();

        // Get today's date range
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Get today's appointments (Scheduled and Checked-in)
        List<Appointment> todayAppointments = appointmentRepository.findByDoctorIDAndDateRange(
            doctorID, startOfToday, endOfToday);

        // Filter to only include Scheduled and Checked-in status (case-insensitive)
        List<Appointment> scheduledAndCheckedIn = todayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Scheduled".equalsIgnoreCase(status) || 
                       "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status);
            })
            .collect(Collectors.toList());

        // Get waiting queue (patients with Checked-in, In Consultation, or Completed status - case-insensitive)
        List<Appointment> waitingQueueAppointments = todayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) || 
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status);
            })
            .collect(Collectors.toList());

        // Convert to DTOs
        List<AppointmentDTO> todayAppointmentDTOs = scheduledAndCheckedIn.stream()
            .map(this::convertToAppointmentDTO)
            .collect(Collectors.toList());

        List<AppointmentDTO> waitingQueueDTOs = waitingQueueAppointments.stream()
            .map(this::convertToAppointmentDTO)
            .collect(Collectors.toList());

        return new DoctorDashboardDTO(doctorName, todayAppointmentDTOs, waitingQueueDTOs);
    }

    private AppointmentDTO convertToAppointmentDTO(Appointment appointment) {
        try {
            Patient patient = patientRepository.findById(appointment.getPatientID())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));

            return new AppointmentDTO(
                appointment.getAppointmentID(),
                appointment.getDateTime(),
                appointment.getStatus(),
                appointment.getPatientID(),
                patient.getFullName() != null ? patient.getFullName() : "Unknown",
                patient.getPatientCode() != null ? patient.getPatientCode() : "",
                appointment.getDoctorID(),
                appointment.getReceptionistID()
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi appointment ID " + appointment.getAppointmentID() + ": " + e.getMessage(), e);
        }
    }
}

