package com.clinicSys.controller;

import com.clinicSys.dto.request.SavePrescriptionDTO;
import com.clinicSys.dto.response.MedicineDTO;
import com.clinicSys.dto.response.PrescriptionDTO;
import com.clinicSys.service.IPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/prescription")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PrescriptionController {

    @Autowired
    private IPrescriptionService prescriptionService;

    @GetMapping("/medicines/search")
    public ResponseEntity<?> searchMedicines(@RequestParam String q) {
        try {
            List<MedicineDTO> medicines = prescriptionService.searchMedicines(q);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi tìm kiếm thuốc: " + e.getMessage()));
        }
    }

    @GetMapping("/appointment/{appointmentID}")
    public ResponseEntity<?> getPrescriptionByAppointmentID(@PathVariable int appointmentID) {
        try {
            PrescriptionDTO prescription = prescriptionService.getPrescriptionByAppointmentID(appointmentID);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lấy dữ liệu prescription: " + e.getMessage()));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePrescription(@RequestBody SavePrescriptionDTO saveDTO) {
        try {
            PrescriptionDTO prescription = prescriptionService.savePrescription(saveDTO);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi khi lưu prescription: " + e.getMessage()));
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

