package com.clinicSys.controller;

import com.clinicSys.dto.request.CreatePatientDTO;
import com.clinicSys.dto.request.UpdatePatientDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.service.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist/patients")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PatientController {

    @Autowired
    private IPatientService patientService;

    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        try {
            List<PatientDTO> patients = patientService.getAllPatients();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy danh sách bệnh nhân: " + e.getMessage()));
        }
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> getPatientById(@PathVariable int patientId) {
        try {
            PatientDTO patient = patientService.getPatientById(patientId);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy thông tin bệnh nhân: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPatients(@RequestParam String q) {
        try {
            List<PatientDTO> patients = patientService.searchPatients(q);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tìm kiếm bệnh nhân: " + e.getMessage()));
        }
    }

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

    @PutMapping("/{patientId}")
    public ResponseEntity<?> updatePatient(@PathVariable int patientId, @RequestBody UpdatePatientDTO updatePatientDTO) {
        try {
            PatientDTO patient = patientService.updatePatient(patientId, updatePatientDTO);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi cập nhật bệnh nhân: " + e.getMessage()));
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

