package com.clinicSys.service.impl;

import com.clinicSys.domain.Medicine;
import com.clinicSys.domain.MedicineGroup;
import com.clinicSys.dto.request.CreateMedicineDTO;
import com.clinicSys.dto.response.MedicineDTO;
import com.clinicSys.dto.response.MedicineGroupDTO;
import com.clinicSys.dto.request.UpdateMedicineDTO;
import com.clinicSys.repository.IMedicineRepository;
import com.clinicSys.repository.IMedicineGroupRepository;
import com.clinicSys.service.IMedicineService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class MedicineServiceImpl implements IMedicineService {

    @Autowired
    private IMedicineRepository medicineRepository;

    @Autowired
    private IMedicineGroupRepository medicineGroupRepository;

    @Override
    public List<MedicineDTO> getAllMedicines() {
        try {
            List<Medicine> medicines = medicineRepository.findAll();
            return medicines.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching medicines: " + e.getMessage(), e);
        }
    }

    @Override
    public MedicineDTO getMedicineById(int medicineId) {
        Optional<Medicine> medicineOpt = medicineRepository.findById(medicineId);
        if (medicineOpt.isEmpty()) {
            throw new RuntimeException("Medicine not found with ID: " + medicineId);
        }
        return convertToDTO(medicineOpt.get());
    }

    @Override
    public List<MedicineGroupDTO> getAllMedicineGroups() {
        return medicineGroupRepository.findByStatus("Active").stream()
                .map(mg -> new MedicineGroupDTO(mg.getMedicineGroupID(), mg.getName(), mg.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public MedicineDTO createMedicine(CreateMedicineDTO createDTO) {
        Optional<Medicine> existingMedicine = medicineRepository.findByMedicineCode(createDTO.medicineCode());
        if (existingMedicine.isPresent()) {
            throw new RuntimeException("Medicine code already exists: " + createDTO.medicineCode());
        }
        Optional<MedicineGroup> medicineGroupOpt = medicineGroupRepository.findById(createDTO.medicineGroupID());
        if (medicineGroupOpt.isEmpty()) {
            throw new RuntimeException("MedicineGroup not found with ID: " + createDTO.medicineGroupID());
        }

        Medicine newMedicine = new Medicine();
        newMedicine.setMedicineCode(createDTO.medicineCode());
        newMedicine.setMedicineGroupID(createDTO.medicineGroupID());
        newMedicine.setName(createDTO.medicineName());
        newMedicine.setStrength(createDTO.strength());
        newMedicine.setUnit(createDTO.unit());
        newMedicine.setPrice(createDTO.price());
        newMedicine.setStock(createDTO.stock());
        newMedicine.setStatus(createDTO.status());

        Medicine savedMedicine = medicineRepository.save(newMedicine);
        return convertToDTO(savedMedicine);
    }

    @Override
    public MedicineDTO updateMedicine(int medicineId, UpdateMedicineDTO updateDTO) {
        Optional<Medicine> medicineOpt = medicineRepository.findById(medicineId);
        if (medicineOpt.isEmpty()) {
            throw new RuntimeException("Medicine not found with ID: " + medicineId);
        }

        Medicine medicine = medicineOpt.get();

        if (updateDTO.medicineName() != null && !updateDTO.medicineName().isEmpty()) {
            medicine.setName(updateDTO.medicineName());
        }

        if (updateDTO.medicineGroupID() != null) {
            Optional<MedicineGroup> medicineGroupOpt = medicineGroupRepository.findById(updateDTO.medicineGroupID());
            if (medicineGroupOpt.isEmpty()) {
                throw new RuntimeException("MedicineGroup not found with ID: " + updateDTO.medicineGroupID());
            }
            medicine.setMedicineGroupID(updateDTO.medicineGroupID());
        }

        if (updateDTO.strength() != null) {
            medicine.setStrength(updateDTO.strength());
        }

        if (updateDTO.unit() != null) {
            medicine.setUnit(updateDTO.unit());
        }

        if (updateDTO.price() != null) {
            medicine.setPrice(updateDTO.price());
        }

        if (updateDTO.status() != null && !updateDTO.status().isEmpty()) {
            medicine.setStatus(updateDTO.status());
        }

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return convertToDTO(updatedMedicine);
    }

    @Override
    public MedicineDTO updateMedicineStatus(int medicineId, String status) {
        Optional<Medicine> medicineOpt = medicineRepository.findById(medicineId);
        if (medicineOpt.isEmpty()) {
            throw new RuntimeException("Medicine not found with ID: " + medicineId);
        }

        Medicine medicine = medicineOpt.get();
        medicine.setStatus(status);
        Medicine updatedMedicine = medicineRepository.save(medicine);
        return convertToDTO(updatedMedicine);
    }

    private MedicineDTO convertToDTO(Medicine medicine) {
        String medicineGroupName = "Unknown";
        Optional<MedicineGroup> medicineGroupOpt = medicineGroupRepository.findById(medicine.getMedicineGroupID());
        if (medicineGroupOpt.isPresent()) {
            medicineGroupName = medicineGroupOpt.get().getName();
        }

        return new MedicineDTO(
            medicine.getMedicineID(),
            medicine.getMedicineCode(),
            medicine.getName(),
            medicineGroupName,
            medicine.getMedicineGroupID(),
            medicine.getStrength(),
            medicine.getUnit() != null ? medicine.getUnit() : "",
            medicine.getPrice(),
            medicine.getStock(),
            medicine.getStatus()
        );
    }
}

