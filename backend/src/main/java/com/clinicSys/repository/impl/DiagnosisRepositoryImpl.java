package com.clinicSys.repository.impl;

import com.clinicSys.domain.Diagnosis;
import com.clinicSys.repository.IDiagnosisRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class DiagnosisRepositoryImpl implements IDiagnosisRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Diagnosis> findByRecordID(int recordID) {
        TypedQuery<Diagnosis> query = entityManager.createQuery(
            "SELECT d FROM Diagnosis d WHERE d.recordID = :recordID ORDER BY d.date DESC",
            Diagnosis.class);
        query.setParameter("recordID", recordID);
        return query.getResultList();
    }

    @Override
    public List<Diagnosis> findByPatientID(int patientID) {
        // Join với MedicalRecord và Appointment để lấy diagnoses theo patientID
        TypedQuery<Diagnosis> query = entityManager.createQuery(
            "SELECT d FROM Diagnosis d " +
            "JOIN MedicalRecord mr ON d.recordID = mr.recordID " +
            "JOIN Appointment a ON mr.appointmentID = a.appointmentID " +
            "WHERE a.patientID = :patientID " +
            "ORDER BY d.date DESC",
            Diagnosis.class);
        query.setParameter("patientID", patientID);
        return query.getResultList();
    }

    @Override
    public Diagnosis save(Diagnosis diagnosis) {
        if (diagnosis.getDiagnosisID() == 0 || !entityManager.contains(diagnosis)) {
            entityManager.persist(diagnosis);
            entityManager.flush();
            return diagnosis;
        } else {
            return entityManager.merge(diagnosis);
        }
    }
}

