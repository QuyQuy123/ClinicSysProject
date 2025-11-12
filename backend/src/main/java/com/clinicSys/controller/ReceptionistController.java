package com.clinicSys.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinicSys.dto.request.CreateAppointmentDTO;
import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.dto.response.ServiceDTO;
import com.clinicSys.dto.response.UserDTO;
import com.clinicSys.service.IReceptionistService;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReceptionistController {

    @Autowired
    private IReceptionistService receptionistService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getReceptionistDashboard() {
        try {
            ReceptionistDashboardDTO dashboard = receptionistService.getDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy dữ liệu dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/appointments/week")
    public ResponseEntity<?> getAppointmentsByWeek(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        try {
            return ResponseEntity.ok(receptionistService.getAppointmentsByWeek(weekStart));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy danh sách lịch hẹn: " + e.getMessage()));
        }
    }

    @GetMapping("/appointments/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable int appointmentId) {
        try {
            AppointmentDetailsDTO appointment = receptionistService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy thông tin lịch hẹn: " + e.getMessage()));
        }
    }

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable int appointmentId,
            @RequestBody UpdateStatusRequest request) {
        try {
            AppointmentDetailsDTO appointment = receptionistService.updateAppointmentStatus(
                appointmentId, request.getStatus());
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi cập nhật trạng thái: " + e.getMessage()));
        }
    }

    @GetMapping("/appointments/patients/search")
    public ResponseEntity<?> searchPatientsByName(@RequestParam String name) {
        try {
            List<PatientDTO> patients = receptionistService.searchPatientsByName(name);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tìm kiếm bệnh nhân: " + e.getMessage()));
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<UserDTO> doctors = receptionistService.getAllDoctors();
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy danh sách bác sĩ: " + e.getMessage()));
        }
    }

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        try {
            List<ServiceDTO> services = receptionistService.getAllServices();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy danh sách dịch vụ: " + e.getMessage()));
        }
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentDTO createAppointmentDTO) {
        try {
            return ResponseEntity.ok(receptionistService.createAppointment(createAppointmentDTO));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tạo lịch hẹn: " + e.getMessage()));
        }
    }

    // Inner class for error response
    private static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }

    // Inner class for update status request
    private static class UpdateStatusRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}

