package com.clinicSys.controller;

import com.clinicSys.dto.request.SaveConsultationDTO;
import com.clinicSys.dto.response.ConsultationDataDTO;
import com.clinicSys.dto.response.EMRDTO;
import com.clinicSys.dto.response.ICD10CodeDTO;
import com.clinicSys.service.IEMRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/emr")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EMRController {

    @Autowired
    private IEMRService emrService;

    @GetMapping("/appointment/{appointmentID}")
    public ResponseEntity<?> getEMRByAppointmentID(@PathVariable int appointmentID) {
        try {
            EMRDTO emr = emrService.getEMRByAppointmentID(appointmentID);
            return ResponseEntity.ok(emr);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy dữ liệu EMR: " + e.getMessage()));
        }
    }

    @PostMapping("/appointment/{appointmentID}/start-consultation")
    public ResponseEntity<?> startConsultation(@PathVariable int appointmentID) {
        try {
            emrService.startConsultation(appointmentID);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi bắt đầu consultation: " + e.getMessage()));
        }
    }

    @GetMapping("/icd10/search")
    public ResponseEntity<?> searchICD10Codes(@RequestParam String q) {
        try {
            List<ICD10CodeDTO> codes = emrService.searchICD10Codes(q);
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tìm kiếm ICD10: " + e.getMessage()));
        }
    }

    @GetMapping("/consultation/{appointmentID}")
    public ResponseEntity<?> getConsultationData(@PathVariable int appointmentID) {
        try {
            ConsultationDataDTO data = emrService.getConsultationData(appointmentID);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy dữ liệu consultation: " + e.getMessage()));
        }
    }

    @PostMapping("/consultation/save")
    public ResponseEntity<?> saveConsultation(@RequestBody SaveConsultationDTO saveDTO) {
        try {
            emrService.saveConsultation(saveDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lưu consultation: " + e.getMessage()));
        }
    }

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

