package com.clinicSys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicSys.dto.CreateMedicineDTO;
import com.clinicSys.dto.MedicineDTO;
import com.clinicSys.dto.MedicineGroupDTO;
import com.clinicSys.dto.UpdateMedicineDTO;
import com.clinicSys.dto.UpdateUserStatusDTO;
import com.clinicSys.service.IMedicineService;

@RestController
@RequestMapping("/api/admin/medicines")
public class MedicineController {

    @Autowired
    private IMedicineService medicineService;

    // API để lấy danh sách tất cả medicines
    @GetMapping
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        try {
            List<MedicineDTO> medicines = medicineService.getAllMedicines();
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    // API để lấy thông tin một medicine theo ID
    @GetMapping("/{medicineId}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable int medicineId) {
        MedicineDTO medicine = medicineService.getMedicineById(medicineId);
        return ResponseEntity.ok(medicine);
    }

    // API để lấy danh sách medicine groups
    @GetMapping("/groups")
    public ResponseEntity<List<MedicineGroupDTO>> getAllMedicineGroups() {
        List<MedicineGroupDTO> groups = medicineService.getAllMedicineGroups();
        return ResponseEntity.ok(groups);
    }

    // API để tạo medicine mới
    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(@RequestBody CreateMedicineDTO createDTO) {
        MedicineDTO newMedicine = medicineService.createMedicine(createDTO);
        return ResponseEntity.ok(newMedicine);
    }

    // API để cập nhật medicine
    @PutMapping("/{medicineId}")
    public ResponseEntity<MedicineDTO> updateMedicine(
            @PathVariable int medicineId,
            @RequestBody UpdateMedicineDTO updateDTO) {
        MedicineDTO updatedMedicine = medicineService.updateMedicine(medicineId, updateDTO);
        return ResponseEntity.ok(updatedMedicine);
    }

    // API để cập nhật status của medicine
    @PutMapping("/{medicineId}/status")
    public ResponseEntity<MedicineDTO> updateMedicineStatus(
            @PathVariable int medicineId,
            @RequestBody UpdateUserStatusDTO statusDTO) {
        MedicineDTO updatedMedicine = medicineService.updateMedicineStatus(medicineId, statusDTO.status());
        return ResponseEntity.ok(updatedMedicine);
    }
}

