package com.clinicSys.repository;

import com.clinicSys.domain.Prescription;
import java.util.List;
import java.util.Optional;

public interface IPrescriptionRepository {
    Optional<Prescription> findById(int id);
    Prescription save(Prescription prescription);
    Optional<Prescription> findByRecordID(int recordID);
    List<Prescription> findAll();
}

