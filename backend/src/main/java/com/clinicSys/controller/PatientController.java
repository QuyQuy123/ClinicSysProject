package com.clinicSys.controller;

import com.clinicSys.dto.request.CreatePatientDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.service.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receptionist/patients")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PatientController {

    @Autowired
    private IPatientService patientService;

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody CreatePatientDTO createPatientDTO) {
        try {
            PatientDTO patient = patientService.createPatient(createPatientDTO);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tạo bệnh nhân: " + e.getMessage()));
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

