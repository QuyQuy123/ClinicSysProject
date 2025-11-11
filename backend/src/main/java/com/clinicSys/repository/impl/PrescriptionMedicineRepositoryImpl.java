package com.clinicSys.repository.impl;

import com.clinicSys.domain.PrescriptionMedicine;
import com.clinicSys.repository.IPrescriptionMedicineRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class PrescriptionMedicineRepositoryImpl implements IPrescriptionMedicineRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<PrescriptionMedicine> findByPrescriptionID(int prescriptionID) {
        TypedQuery<PrescriptionMedicine> query = entityManager.createQuery(
            "SELECT pm FROM PrescriptionMedicine pm WHERE pm.prescriptionID = :prescriptionID",
            PrescriptionMedicine.class);
        query.setParameter("prescriptionID", prescriptionID);
        return query.getResultList();
    }

    @Override
    public PrescriptionMedicine save(PrescriptionMedicine prescriptionMedicine) {
        if (prescriptionMedicine.getPrescriptionMedicineID() == 0 || !entityManager.contains(prescriptionMedicine)) {
            entityManager.persist(prescriptionMedicine);
            entityManager.flush();
            return prescriptionMedicine;
        } else {
            return entityManager.merge(prescriptionMedicine);
        }
    }

    @Override
    public void deleteById(int id) {
        PrescriptionMedicine pm = entityManager.find(PrescriptionMedicine.class, id);
        if (pm != null) {
            entityManager.remove(pm);
        }
    }

    @Override
    public void deleteByPrescriptionID(int prescriptionID) {
        TypedQuery<PrescriptionMedicine> query = entityManager.createQuery(
            "SELECT pm FROM PrescriptionMedicine pm WHERE pm.prescriptionID = :prescriptionID",
            PrescriptionMedicine.class);
        query.setParameter("prescriptionID", prescriptionID);
        List<PrescriptionMedicine> items = query.getResultList();
        for (PrescriptionMedicine item : items) {
            entityManager.remove(item);
        }
    }
}

