package com.clinicSys.service.impl;

import com.clinicSys.domain.*;
import com.clinicSys.dto.request.SaveConsultationDTO;
import com.clinicSys.dto.response.ConsultationDataDTO;
import com.clinicSys.dto.response.EMRDTO;
import com.clinicSys.dto.response.ICD10CodeDTO;
import com.clinicSys.dto.response.VisitHistoryDTO;
import com.clinicSys.repository.*;
import com.clinicSys.service.IEMRService;
import com.clinicSys.repository.IICD10CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EMRServiceImpl implements IEMRService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IMedicalRecordRepository medicalRecordRepository;

    @Autowired
    private IDiagnosisRepository diagnosisRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IICD10CodeRepository icd10CodeRepository;

    @Override
    public EMRDTO getEMRByAppointmentID(int appointmentID) {
        // Get appointment
        Appointment appointment = appointmentRepository.findById(appointmentID)
            .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentID));

        // Get patient
        Patient patient = patientRepository.findById(appointment.getPatientID())
            .orElseThrow(() -> new RuntimeException("Patient not found: " + appointment.getPatientID()));

        // Calculate age
        LocalDate today = LocalDate.now();
        int age = Period.between(patient.getDateOfBirth(), today).getYears();

        // Get all visit history for this patient
        List<MedicalRecord> allRecords = medicalRecordRepository.findByPatientID(patient.getPatientID());
        List<VisitHistoryDTO> visitHistory = new ArrayList<>();

        for (MedicalRecord record : allRecords) {
            // Get appointment for this record
            Optional<Appointment> recordAppointment = appointmentRepository.findById(record.getAppointmentID());
            if (recordAppointment.isEmpty()) continue;

            // Get diagnosis for this record
            List<Diagnosis> diagnoses = diagnosisRepository.findByRecordID(record.getRecordID());
            
            // Get primary diagnosis (first one or most recent)
            String primaryDiagnosis = "N/A";
            String diagnosisCode = "N/A";
            if (!diagnoses.isEmpty()) {
                Diagnosis primary = diagnoses.get(0);
                primaryDiagnosis = primary.getDescription() != null ? primary.getDescription() : "N/A";
                // Get ICD10 code - we'll need to query it
                diagnosisCode = getICD10Code(primary.getIcd10CodeID());
            }

            // Get doctor name
            String doctorName = getDoctorName(recordAppointment.get().getDoctorID());

            visitHistory.add(new VisitHistoryDTO(
                record.getAppointmentID(),
                recordAppointment.get().getDateTime(),
                record.getSymptoms() != null ? record.getSymptoms() : "N/A",
                primaryDiagnosis,
                diagnosisCode,
                doctorName
            ));
        }

        return new EMRDTO(
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            age,
            patient.getGender(),
            visitHistory
        );
    }

    @Override
    public void startConsultation(int appointmentID) {
        Appointment appointment = appointmentRepository.findById(appointmentID)
            .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentID));
        
        appointment.setStatus("In Consultation");
        appointmentRepository.save(appointment);
    }

    private String getICD10Code(int codeID) {
        Optional<ICD10Code> code = icd10CodeRepository.findById(codeID);
        if (code.isPresent()) {
            return code.get().getCode();
        }
        return "N/A";
    }

    private String getDoctorName(int doctorID) {
        Optional<User> doctor = userRepository.findById(doctorID);
        if (doctor.isPresent()) {
            return doctor.get().getFullName() != null && !doctor.get().getFullName().isEmpty()
                ? doctor.get().getFullName()
                : doctor.get().getUsername();
        }
        return "Unknown";
    }

    @Override
    public List<ICD10CodeDTO> searchICD10Codes(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return new ArrayList<>();
        }
        List<ICD10Code> codes = icd10CodeRepository.searchByCodeOrDescription(searchTerm.trim());
        return codes.stream()
            .map(code -> new ICD10CodeDTO(code.getCodeID(), code.getCode(), code.getDescription()))
            .collect(Collectors.toList());
    }

    @Override
    public void saveConsultation(SaveConsultationDTO saveDTO) {
        // Get current authenticated doctor
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.");
        }
        User currentUser = (User) authentication.getPrincipal();
        int doctorID = currentUser.getUserID();

        // Check if appointment exists
        appointmentRepository.findById(saveDTO.appointmentID())
            .orElseThrow(() -> new RuntimeException("Appointment not found: " + saveDTO.appointmentID()));

        // Check if MedicalRecord already exists for this appointment
        Optional<MedicalRecord> existingRecord = medicalRecordRepository.findByAppointmentID(saveDTO.appointmentID());
        MedicalRecord medicalRecord;

        if (existingRecord.isPresent()) {
            // Update existing record
            medicalRecord = existingRecord.get();
            medicalRecord.setVitals(saveDTO.vitals());
            medicalRecord.setSymptoms(saveDTO.symptoms());
            medicalRecord.setNotes(saveDTO.notes());
            medicalRecord.setModifiedBy(doctorID);
        } else {
            // Create new record
            medicalRecord = new MedicalRecord();
            medicalRecord.setVitals(saveDTO.vitals());
            medicalRecord.setSymptoms(saveDTO.symptoms());
            medicalRecord.setNotes(saveDTO.notes());
            medicalRecord.setAppointmentID(saveDTO.appointmentID());
            medicalRecord.setCreatedBy(doctorID);
        }

        medicalRecord = medicalRecordRepository.save(medicalRecord);

        // Save Diagnosis if ICD10CodeID is provided
        if (saveDTO.icd10CodeID() != null && saveDTO.icd10CodeID() > 0) {
            // Check if diagnosis already exists for this record
            List<Diagnosis> existingDiagnoses = diagnosisRepository.findByRecordID(medicalRecord.getRecordID());
            
            if (existingDiagnoses.isEmpty()) {
                // Create new diagnosis
                Diagnosis diagnosis = new Diagnosis();
                diagnosis.setDescription(null); // Can be set later if needed
                diagnosis.setDate(LocalDateTime.now());
                diagnosis.setRecordID(medicalRecord.getRecordID());
                diagnosis.setIcd10CodeID(saveDTO.icd10CodeID());
                diagnosis.setCreatedBy(doctorID);
                diagnosisRepository.save(diagnosis);
            } else {
                // Update existing diagnosis (take the first one)
                Diagnosis diagnosis = existingDiagnoses.get(0);
                diagnosis.setIcd10CodeID(saveDTO.icd10CodeID());
                diagnosis.setDate(LocalDateTime.now());
                diagnosisRepository.save(diagnosis);
            }
        }
    }

    @Override
    public ConsultationDataDTO getConsultationData(int appointmentID) {
        // Get MedicalRecord for this appointment
        Optional<MedicalRecord> medicalRecord = medicalRecordRepository.findByAppointmentID(appointmentID);
        
        if (medicalRecord.isEmpty()) {
            // Return empty data if no record exists
            return new ConsultationDataDTO(
                appointmentID,
                null,
                null,
                null,
                null,
                null,
                null
            );
        }

        MedicalRecord record = medicalRecord.get();
        
        // Get Diagnosis for this record
        List<Diagnosis> diagnoses = diagnosisRepository.findByRecordID(record.getRecordID());
        
        Integer icd10CodeID = null;
        String icd10Code = null;
        String icd10Description = null;
        
        if (!diagnoses.isEmpty()) {
            Diagnosis diagnosis = diagnoses.get(0);
            icd10CodeID = diagnosis.getIcd10CodeID();
            
            // Get ICD10 code details
            Optional<ICD10Code> icd10 = icd10CodeRepository.findById(icd10CodeID);
            if (icd10.isPresent()) {
                icd10Code = icd10.get().getCode();
                icd10Description = icd10.get().getDescription();
            }
        }

        return new ConsultationDataDTO(
            appointmentID,
            record.getVitals(),
            record.getSymptoms(),
            record.getNotes(),
            icd10CodeID,
            icd10Code,
            icd10Description
        );
    }
}

