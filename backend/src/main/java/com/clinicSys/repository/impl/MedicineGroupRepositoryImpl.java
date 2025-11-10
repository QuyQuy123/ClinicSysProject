package com.clinicSys.repository.impl;

import com.clinicSys.domain.MedicineGroup;
import com.clinicSys.repository.IMedicineGroupRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class MedicineGroupRepositoryImpl implements IMedicineGroupRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<MedicineGroup> findById(int id) {
        MedicineGroup medicineGroup = entityManager.find(MedicineGroup.class, id);
        return Optional.ofNullable(medicineGroup);
    }

    @Override
    public List<MedicineGroup> findAll() {
        TypedQuery<MedicineGroup> query = entityManager.createQuery("SELECT mg FROM MedicineGroup mg ORDER BY mg.name", MedicineGroup.class);
        return query.getResultList();
    }

    @Override
    public List<MedicineGroup> findByStatus(String status) {
        TypedQuery<MedicineGroup> query = entityManager.createQuery(
            "SELECT mg FROM MedicineGroup mg WHERE mg.status = :status", MedicineGroup.class);
        query.setParameter("status", status);
        return query.getResultList();
    }
}

