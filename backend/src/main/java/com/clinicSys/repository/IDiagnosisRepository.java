package com.clinicSys.repository;

import com.clinicSys.domain.Diagnosis;
import java.util.List;

public interface IDiagnosisRepository {
    List<Diagnosis> findByRecordID(int recordID);
    List<Diagnosis> findByPatientID(int patientID);
    Diagnosis save(Diagnosis diagnosis);
}

