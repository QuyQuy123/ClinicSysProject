package com.clinicSys.service.impl;

import com.clinicSys.domain.*;
import com.clinicSys.dto.request.SavePrescriptionDTO;
import com.clinicSys.dto.response.MedicineDTO;
import com.clinicSys.dto.response.PrescriptionDTO;
import com.clinicSys.dto.response.PrescriptionItemDTO;
import com.clinicSys.repository.*;
import com.clinicSys.service.IPrescriptionService;
import com.clinicSys.repository.IMedicineGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements IPrescriptionService {

    @Autowired
    private IMedicineRepository medicineRepository;

    @Autowired
    private IMedicalRecordRepository medicalRecordRepository;

    @Autowired
    private IPrescriptionRepository prescriptionRepository;

    @Autowired
    private IPrescriptionMedicineRepository prescriptionMedicineRepository;

    @Autowired
    private IMedicineGroupRepository medicineGroupRepository;

    @Override
    public List<MedicineDTO> searchMedicines(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return new ArrayList<>();
        }
        List<Medicine> medicines = medicineRepository.searchByName(searchTerm.trim());
        return medicines.stream()
            .map(this::convertToMedicineDTO)
            .collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO getPrescriptionByAppointmentID(int appointmentID) {
        // Get MedicalRecord for this appointment
        Optional<MedicalRecord> medicalRecord = medicalRecordRepository.findByAppointmentID(appointmentID);
        
        if (medicalRecord.isEmpty()) {
            // Return empty prescription if no record exists
            return new PrescriptionDTO(
                0,
                null,
                null,
                null,
                null,
                0,
                new ArrayList<>()
            );
        }

        int recordID = medicalRecord.get().getRecordID();
        
        // Get Prescription for this record
        Optional<Prescription> prescription = prescriptionRepository.findByRecordID(recordID);
        
        if (prescription.isEmpty()) {
            return new PrescriptionDTO(
                0,
                null,
                null,
                null,
                null,
                recordID,
                new ArrayList<>()
            );
        }

        Prescription pres = prescription.get();
        
        // Get prescription items
        List<PrescriptionMedicine> items = prescriptionMedicineRepository.findByPrescriptionID(pres.getPrescriptionID());
        List<PrescriptionItemDTO> itemDTOs = items.stream()
            .map(this::convertToPrescriptionItemDTO)
            .collect(Collectors.toList());

        return new PrescriptionDTO(
            pres.getPrescriptionID(),
            pres.getPrescriptionCode(),
            pres.getDate(),
            pres.getNotes(),
            pres.getAiAlerts(),
            pres.getRecordID(),
            itemDTOs
        );
    }

    @Override
    public PrescriptionDTO savePrescription(SavePrescriptionDTO saveDTO) {
        // Get current authenticated doctor
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.");
        }
        User currentUser = (User) authentication.getPrincipal();
        int doctorID = currentUser.getUserID();

        // Get MedicalRecord for this appointment
        Optional<MedicalRecord> medicalRecord = medicalRecordRepository.findByAppointmentID(saveDTO.appointmentID());
        if (medicalRecord.isEmpty()) {
            throw new RuntimeException("MedicalRecord not found for appointment: " + saveDTO.appointmentID());
        }

        int recordID = medicalRecord.get().getRecordID();
        
        // Check if prescription already exists
        Optional<Prescription> existingPrescription = prescriptionRepository.findByRecordID(recordID);
        Prescription prescription;

        if (existingPrescription.isPresent()) {
            // Update existing prescription
            prescription = existingPrescription.get();
            prescription.setNotes(saveDTO.notes());
            prescription.setAiAlerts(saveDTO.aiAlerts());
            prescription.setDate(LocalDateTime.now());
        } else {
            // Create new prescription
            prescription = new Prescription();
            prescription.setPrescriptionCode("P-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            prescription.setDate(LocalDateTime.now());
            prescription.setNotes(saveDTO.notes());
            prescription.setAiAlerts(saveDTO.aiAlerts());
            prescription.setRecordID(recordID);
            prescription.setCreatedBy(doctorID);
        }

        prescription = prescriptionRepository.save(prescription);

        // Delete existing prescription items
        prescriptionMedicineRepository.deleteByPrescriptionID(prescription.getPrescriptionID());

        // Save new prescription items
        List<PrescriptionItemDTO> savedItems = new ArrayList<>();
        for (SavePrescriptionDTO.PrescriptionItemRequestDTO itemDTO : saveDTO.items()) {
            PrescriptionMedicine pm = new PrescriptionMedicine();
            pm.setPrescriptionID(prescription.getPrescriptionID());
            pm.setMedicineID(itemDTO.medicineID());
            pm.setQuantity(itemDTO.quantity());
            pm.setNote(itemDTO.note());
            pm = prescriptionMedicineRepository.save(pm);
            
            // Convert to DTO
            Optional<Medicine> medicine = medicineRepository.findById(itemDTO.medicineID());
            if (medicine.isPresent()) {
                Medicine med = medicine.get();
                savedItems.add(new PrescriptionItemDTO(
                    pm.getPrescriptionMedicineID(),
                    med.getMedicineID(),
                    med.getName(),
                    med.getMedicineCode(),
                    med.getStrength(),
                    pm.getQuantity(),
                    pm.getNote()
                ));
            }
        }

        return new PrescriptionDTO(
            prescription.getPrescriptionID(),
            prescription.getPrescriptionCode(),
            prescription.getDate(),
            prescription.getNotes(),
            prescription.getAiAlerts(),
            prescription.getRecordID(),
            savedItems
        );
    }

    private MedicineDTO convertToMedicineDTO(Medicine medicine) {
        // Get medicine group name
        String groupName = "Unknown";
        Optional<MedicineGroup> group = medicineGroupRepository.findById(medicine.getMedicineGroupID());
        if (group.isPresent()) {
            groupName = group.get().getName();
        }

        return new MedicineDTO(
            medicine.getMedicineID(),
            medicine.getMedicineCode(),
            medicine.getName(),
            groupName,
            medicine.getMedicineGroupID(),
            medicine.getStrength(),
            medicine.getUnit(),
            medicine.getPrice(),
            medicine.getStock(),
            medicine.getStatus()
        );
    }

    private PrescriptionItemDTO convertToPrescriptionItemDTO(PrescriptionMedicine pm) {
        Optional<Medicine> medicine = medicineRepository.findById(pm.getMedicineID());
        if (medicine.isEmpty()) {
            throw new RuntimeException("Medicine not found: " + pm.getMedicineID());
        }

        Medicine med = medicine.get();
        return new PrescriptionItemDTO(
            pm.getPrescriptionMedicineID(),
            med.getMedicineID(),
            med.getName(),
            med.getMedicineCode(),
            med.getStrength(),
            pm.getQuantity(),
            pm.getNote()
        );
    }
}

