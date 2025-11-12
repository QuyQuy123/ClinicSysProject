package com.clinicSys.controller;

import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.service.IReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

