package com.clinicSys.repository;

import com.clinicSys.domain.MedicalRecord;
import java.util.List;
import java.util.Optional;

public interface IMedicalRecordRepository {
    Optional<MedicalRecord> findById(int id);
    MedicalRecord save(MedicalRecord medicalRecord);
    Optional<MedicalRecord> findByAppointmentID(int appointmentID);
    List<MedicalRecord> findByPatientID(int patientID);
}

