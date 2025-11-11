package com.clinicSys.repository.impl;

import com.clinicSys.domain.Prescription;
import com.clinicSys.repository.IPrescriptionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class PrescriptionRepositoryImpl implements IPrescriptionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Prescription> findById(int id) {
        Prescription prescription = entityManager.find(Prescription.class, id);
        return Optional.ofNullable(prescription);
    }

    @Override
    public Prescription save(Prescription prescription) {
        if (prescription.getPrescriptionID() == 0 || !entityManager.contains(prescription)) {
            entityManager.persist(prescription);
            entityManager.flush();
            return prescription;
        } else {
            return entityManager.merge(prescription);
        }
    }

    @Override
    public Optional<Prescription> findByRecordID(int recordID) {
        TypedQuery<Prescription> query = entityManager.createQuery(
            "SELECT p FROM Prescription p WHERE p.recordID = :recordID",
            Prescription.class);
        query.setParameter("recordID", recordID);
        try {
            Prescription prescription = query.getSingleResult();
            return Optional.of(prescription);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Prescription> findAll() {
        TypedQuery<Prescription> query = entityManager.createQuery(
            "SELECT p FROM Prescription p", Prescription.class);
        return query.getResultList();
    }
}

