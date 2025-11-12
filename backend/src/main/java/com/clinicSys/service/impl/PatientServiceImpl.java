package com.clinicSys.service.impl;

import com.clinicSys.domain.Patient;
import com.clinicSys.dto.request.CreatePatientDTO;
import com.clinicSys.dto.request.UpdatePatientDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.repository.IPatientRepository;
import com.clinicSys.service.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements IPatientService {

    @Autowired
    private IPatientRepository patientRepository;

    @Override
    public PatientDTO createPatient(CreatePatientDTO createPatientDTO) {
        // Check if phone already exists
        if (createPatientDTO.phone() != null && !createPatientDTO.phone().trim().isEmpty()) {
            patientRepository.findByPhone(createPatientDTO.phone().trim())
                .ifPresent(patient -> {
                    throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống");
                });
        }

        // Check if email already exists (if provided)
        if (createPatientDTO.email() != null && !createPatientDTO.email().trim().isEmpty()) {
            // Note: We don't have findByEmail method, so we'll skip this check for now
            // or we can add it later if needed
        }

        // Generate patient code: P + YYYYMMDD + random 4 digits
        String patientCode = generatePatientCode();

        // Create new patient
        Patient patient = new Patient();
        patient.setPatientCode(patientCode);
        patient.setFullName(createPatientDTO.fullName());
        patient.setDateOfBirth(createPatientDTO.dateOfBirth());
        patient.setGender(createPatientDTO.gender());
        patient.setAddress(createPatientDTO.address() != null ? createPatientDTO.address().trim() : null);
        patient.setPhone(createPatientDTO.phone().trim());
        patient.setEmail(createPatientDTO.email() != null && !createPatientDTO.email().trim().isEmpty() 
            ? createPatientDTO.email().trim() 
            : null);

        Patient savedPatient = patientRepository.save(patient);

        return convertToDTO(savedPatient);
    }

    private String generatePatientCode() {
        // Format: P + YYYYMMDD + random 4 digits
        LocalDate today = LocalDate.now();
        String datePart = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Random random = new Random();
        int randomPart = 1000 + random.nextInt(9000); // 4-digit random number
        
        String code = "P" + datePart + randomPart;
        
        // Check if code already exists (very unlikely but check anyway)
        // Since we don't have findByPatientCode, we'll just use this format
        return code;
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(int patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
        return convertToDTO(patient);
    }

    @Override
    public List<PatientDTO> searchPatients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllPatients();
        }
        List<Patient> patients = patientRepository.searchPatients(searchTerm.trim());
        return patients.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public PatientDTO updatePatient(int patientId, UpdatePatientDTO updatePatientDTO) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));

        // Check if phone is being changed and if new phone already exists
        if (updatePatientDTO.phone() != null && !updatePatientDTO.phone().trim().equals(patient.getPhone())) {
            patientRepository.findByPhone(updatePatientDTO.phone().trim())
                .ifPresent(existingPatient -> {
                    if (existingPatient.getPatientID() != patientId) {
                        throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống");
                    }
                });
        }

        // Update patient fields
        patient.setFullName(updatePatientDTO.fullName());
        patient.setDateOfBirth(updatePatientDTO.dateOfBirth());
        patient.setGender(updatePatientDTO.gender());
        patient.setAddress(updatePatientDTO.address() != null ? updatePatientDTO.address().trim() : null);
        patient.setPhone(updatePatientDTO.phone().trim());
        patient.setEmail(updatePatientDTO.email() != null && !updatePatientDTO.email().trim().isEmpty() 
            ? updatePatientDTO.email().trim() 
            : null);

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    private PatientDTO convertToDTO(Patient patient) {
        return new PatientDTO(
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getAddress(),
            patient.getPhone(),
            patient.getEmail()
        );
    }
}

