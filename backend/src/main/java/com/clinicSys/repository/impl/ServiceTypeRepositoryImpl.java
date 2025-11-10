package com.clinicSys.repository.impl;

import com.clinicSys.domain.ServiceType;
import com.clinicSys.repository.IServiceTypeRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class ServiceTypeRepositoryImpl implements IServiceTypeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ServiceType> findById(int id) {
        ServiceType serviceType = entityManager.find(ServiceType.class, id);
        return Optional.ofNullable(serviceType);
    }

    @Override
    public List<ServiceType> findAll() {
        TypedQuery<ServiceType> query = entityManager.createQuery("SELECT st FROM ServiceType st", ServiceType.class);
        return query.getResultList();
    }

    @Override
    public List<ServiceType> findByStatus(String status) {
        TypedQuery<ServiceType> query = entityManager.createQuery(
            "SELECT st FROM ServiceType st WHERE st.status = :status", ServiceType.class);
        query.setParameter("status", status);
        return query.getResultList();
    }
}

