package com.clinicSys.repository.impl;

import com.clinicSys.domain.Patient;
import com.clinicSys.repository.IPatientRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class PatientRepositoryImpl implements IPatientRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Patient> findById(int id) {
        Patient patient = entityManager.find(Patient.class, id);
        return Optional.ofNullable(patient);
    }

    @Override
    public Patient save(Patient patient) {
        if (patient.getPatientID() == 0 || !entityManager.contains(patient)) {
            entityManager.persist(patient);
            entityManager.flush();
            return patient;
        } else {
            return entityManager.merge(patient);
        }
    }

    @Override
    public List<Patient> findAll() {
        TypedQuery<Patient> query = entityManager.createQuery("SELECT p FROM Patient p", Patient.class);
        return query.getResultList();
    }

    @Override
    public Optional<Patient> findByPhone(String phone) {
        TypedQuery<Patient> query = entityManager.createQuery(
            "SELECT p FROM Patient p WHERE p.phone = :phone", Patient.class);
        query.setParameter("phone", phone);
        try {
            Patient patient = query.getSingleResult();
            return Optional.of(patient);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public Long countDistinctPatientsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(DISTINCT a.patientID) FROM Appointment a " +
            "WHERE a.dateTime >= :startDate AND a.dateTime < :endDate", Long.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        Long result = query.getSingleResult();
        return result != null ? result : 0L;
    }

    @Override
    public Long countNewPatientsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(DISTINCT a.patientID) FROM Appointment a " +
            "WHERE a.dateTime >= :startDate AND a.dateTime < :endDate " +
            "AND a.patientID NOT IN (SELECT a2.patientID FROM Appointment a2 WHERE a2.dateTime < :startDate)", 
            Long.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        Long result = query.getSingleResult();
        return result != null ? result : 0L;
    }

    @Override
    public List<Patient> searchPatients(String searchTerm) {
        String searchPattern = "%" + searchTerm.toLowerCase() + "%";
        TypedQuery<Patient> query = entityManager.createQuery(
            "SELECT p FROM Patient p " +
            "WHERE LOWER(p.fullName) LIKE :searchTerm " +
            "OR LOWER(p.phone) LIKE :searchTerm " +
            "OR LOWER(p.patientCode) LIKE :searchTerm " +
            "ORDER BY p.fullName", Patient.class);
        query.setParameter("searchTerm", searchPattern);
        return query.getResultList();
    }

    @Override
    public List<Patient> searchPatientsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return findAll();
        }
        String searchPattern = "%" + name.toLowerCase().trim() + "%";
        TypedQuery<Patient> query = entityManager.createQuery(
            "SELECT p FROM Patient p " +
            "WHERE LOWER(p.fullName) LIKE :searchTerm " +
            "ORDER BY p.fullName", Patient.class);
        query.setParameter("searchTerm", searchPattern);
        return query.getResultList();
    }
}

