package com.clinicSys.repository.impl;

import com.clinicSys.domain.MedicalRecord;
import com.clinicSys.repository.IMedicalRecordRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class MedicalRecordRepositoryImpl implements IMedicalRecordRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<MedicalRecord> findById(int id) {
        MedicalRecord record = entityManager.find(MedicalRecord.class, id);
        return Optional.ofNullable(record);
    }

    @Override
    public MedicalRecord save(MedicalRecord medicalRecord) {
        if (medicalRecord.getRecordID() == 0 || !entityManager.contains(medicalRecord)) {
            entityManager.persist(medicalRecord);
            entityManager.flush();
            return medicalRecord;
        } else {
            return entityManager.merge(medicalRecord);
        }
    }

    @Override
    public Optional<MedicalRecord> findByAppointmentID(int appointmentID) {
        TypedQuery<MedicalRecord> query = entityManager.createQuery(
            "SELECT mr FROM MedicalRecord mr WHERE mr.appointmentID = :appointmentID", 
            MedicalRecord.class);
        query.setParameter("appointmentID", appointmentID);
        try {
            MedicalRecord record = query.getSingleResult();
            return Optional.of(record);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<MedicalRecord> findByPatientID(int patientID) {
        // Join với Appointment để lấy records theo patientID
        // Order by RecordID DESC to get newest records first (highest ID = newest)
        TypedQuery<MedicalRecord> query = entityManager.createQuery(
            "SELECT mr FROM MedicalRecord mr " +
            "JOIN Appointment a ON mr.appointmentID = a.appointmentID " +
            "WHERE a.patientID = :patientID " +
            "ORDER BY mr.recordID DESC",
            MedicalRecord.class);
        query.setParameter("patientID", patientID);
        return query.getResultList();
    }
}

