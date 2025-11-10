package com.clinicSys.repository.impl;

import com.clinicSys.domain.Medicine;
import com.clinicSys.repository.IMedicineRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class MedicineRepositoryImpl implements IMedicineRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Medicine> findById(int id) {
        Medicine medicine = entityManager.find(Medicine.class, id);
        return Optional.ofNullable(medicine);
    }

    @Override
    public Medicine save(Medicine medicine) {
        if (medicine.getMedicineID() == 0 || !entityManager.contains(medicine)) {
            entityManager.persist(medicine);
            entityManager.flush();
            return medicine;
        } else {
            return entityManager.merge(medicine);
        }
    }

    @Override
    public List<Medicine> findAll() {
        TypedQuery<Medicine> query = entityManager.createQuery("SELECT m FROM Medicine m ORDER BY m.medicineCode", Medicine.class);
        return query.getResultList();
    }

    @Override
    public Optional<Medicine> findByMedicineCode(String medicineCode) {
        TypedQuery<Medicine> query = entityManager.createQuery(
            "SELECT m FROM Medicine m WHERE m.medicineCode = :medicineCode", Medicine.class);
        query.setParameter("medicineCode", medicineCode);
        try {
            Medicine medicine = query.getSingleResult();
            return Optional.of(medicine);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Medicine> findByMedicineGroupID(int medicineGroupID) {
        TypedQuery<Medicine> query = entityManager.createQuery(
            "SELECT m FROM Medicine m WHERE m.medicineGroupID = :medicineGroupID", Medicine.class);
        query.setParameter("medicineGroupID", medicineGroupID);
        return query.getResultList();
    }

    @Override
    public List<Medicine> findByStatus(String status) {
        TypedQuery<Medicine> query = entityManager.createQuery(
            "SELECT m FROM Medicine m WHERE m.status = :status", Medicine.class);
        query.setParameter("status", status);
        return query.getResultList();
    }
}

