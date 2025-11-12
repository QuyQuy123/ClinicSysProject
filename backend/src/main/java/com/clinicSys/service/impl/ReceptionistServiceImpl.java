package com.clinicSys.service.impl;

import com.clinicSys.domain.Appointment;
import com.clinicSys.domain.Patient;
import com.clinicSys.domain.User;
import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.AppointmentWithDoctorDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.repository.IAppointmentRepository;
import com.clinicSys.repository.IBillRepository;
import com.clinicSys.repository.IPatientRepository;
import com.clinicSys.repository.IUserRepository;
import com.clinicSys.service.IReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceptionistServiceImpl implements IReceptionistService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IBillRepository billRepository;

    @Override
    public ReceptionistDashboardDTO getDashboard() {
        // Get today's date range
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Get all today's appointments
        List<Appointment> allTodayAppointments = appointmentRepository.findAllByDateTimeBetween(
            startOfToday, endOfToday);

        // Filter today's appointments: Scheduled, Checked-in, In Consultation, Completed
        List<Appointment> todayAppointments = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Scheduled".equalsIgnoreCase(status) ||
                       "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status);
            })
            .collect(Collectors.toList());

        // Calculate statistics
        long appointmentsToday = todayAppointments.size();
        
        // Total slots today - assuming 30 slots per day (can be configured)
        long totalSlotsToday = 30L;
        
        // Count patients checked in
        long patientsCheckedIn = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status);
            })
            .count();
        
        // Count patients waiting (Checked-in, In Consultation, Completed)
        long patientsWaiting = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status);
            })
            .count();

        // Calculate estimated revenue from today's appointments
        // This can be based on completed appointments or all appointments
        BigDecimal estimatedRevenue = billRepository.getTotalRevenueByDateRange(startOfToday, endOfToday);
        if (estimatedRevenue == null) {
            estimatedRevenue = BigDecimal.ZERO;
        }

        // Convert today's appointments to DTOs
        List<AppointmentWithDoctorDTO> todayAppointmentDTOs = todayAppointments.stream()
            .map(this::convertToAppointmentWithDoctorDTO)
            .collect(Collectors.toList());

        // Create live queue: Checked-in → Waiting, In Consultation → In Consultation, Completed → Ready for Billing
        List<AppointmentWithDoctorDTO> liveQueue = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status);
            })
            .map(this::convertToAppointmentWithDoctorDTOForQueue)
            .collect(Collectors.toList());

        return new ReceptionistDashboardDTO(
            appointmentsToday,
            totalSlotsToday,
            patientsCheckedIn,
            patientsWaiting,
            estimatedRevenue,
            todayAppointmentDTOs,
            liveQueue
        );
    }

    private AppointmentWithDoctorDTO convertToAppointmentWithDoctorDTO(Appointment appointment) {
        try {
            Patient patient = patientRepository.findById(appointment.getPatientID())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
            
            User doctor = userRepository.findById(appointment.getDoctorID())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

            String patientName = patient.getFullName() != null ? patient.getFullName() : "Unknown";
            String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername();

            return new AppointmentWithDoctorDTO(
                appointment.getAppointmentID(),
                appointment.getDateTime(),
                appointment.getStatus(), // Keep original status
                appointment.getPatientID(),
                patientName,
                appointment.getDoctorID(),
                doctorName
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi appointment ID " + appointment.getAppointmentID() + ": " + e.getMessage(), e);
        }
    }

    private AppointmentWithDoctorDTO convertToAppointmentWithDoctorDTOForQueue(Appointment appointment) {
        try {
            Patient patient = patientRepository.findById(appointment.getPatientID())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
            
            User doctor = userRepository.findById(appointment.getDoctorID())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

            String patientName = patient.getFullName() != null ? patient.getFullName() : "Unknown";
            String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername();

            // Map status for queue display
            String queueStatus = mapStatusForQueue(appointment.getStatus());

            return new AppointmentWithDoctorDTO(
                appointment.getAppointmentID(),
                appointment.getDateTime(),
                queueStatus, // Mapped status for queue
                appointment.getPatientID(),
                patientName,
                appointment.getDoctorID(),
                doctorName
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi appointment ID " + appointment.getAppointmentID() + ": " + e.getMessage(), e);
        }
    }

    private String mapStatusForQueue(String originalStatus) {
        if (originalStatus == null) {
            return "Waiting";
        }
        
        String status = originalStatus.trim();
        
        // Checked-in → Waiting
        if ("Checked-in".equalsIgnoreCase(status) || "check-in".equalsIgnoreCase(status)) {
            return "Waiting";
        }
        
        // In Consultation → In Consultation
        if ("In Consultation".equalsIgnoreCase(status) || "in consultation".equalsIgnoreCase(status)) {
            return "In Consultation";
        }
        
        // Completed → Ready for Billing
        if ("Completed".equalsIgnoreCase(status) || "completed".equalsIgnoreCase(status)) {
            return "Ready for Billing";
        }
        
        // Default
        return "Waiting";
    }

    @Override
    public List<AppointmentWithDoctorDTO> getAppointmentsByWeek(LocalDate weekStart) {
        // Calculate week start (Monday) and end (Sunday)
        LocalDate monday = weekStart.with(DayOfWeek.MONDAY);
        LocalDate sunday = monday.plusDays(6);
        
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);
        
        List<Appointment> appointments = appointmentRepository.findAllByDateTimeBetween(startOfWeek, endOfWeek);
        
        return appointments.stream()
            .map(this::convertToAppointmentWithDoctorDTO)
            .collect(Collectors.toList());
    }

    @Override
    public AppointmentDetailsDTO getAppointmentById(int appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        Patient patient = patientRepository.findById(appointment.getPatientID())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
        
        User doctor = userRepository.findById(appointment.getDoctorID())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));
        
        return new AppointmentDetailsDTO(
            appointment.getAppointmentID(),
            appointment.getDateTime(),
            appointment.getStatus(),
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getAddress(),
            patient.getPhone(),
            patient.getEmail(),
            appointment.getDoctorID(),
            doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername(),
            appointment.getReceptionistID()
        );
    }

    @Override
    public AppointmentDetailsDTO updateAppointmentStatus(int appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        appointment.setStatus(newStatus);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        // Return updated appointment details
        return getAppointmentById(updatedAppointment.getAppointmentID());
    }
}

