package com.clinicSys.controller;

import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.service.IReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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

