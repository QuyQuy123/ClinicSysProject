package com.clinicSys.repository.impl;

import com.clinicSys.domain.Service;
import com.clinicSys.repository.IServiceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class ServiceRepositoryImpl implements IServiceRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Service> findById(int id) {
        Service service = entityManager.find(Service.class, id);
        return Optional.ofNullable(service);
    }

    @Override
    public Service save(Service service) {
        if (service.getServiceID() == 0 || !entityManager.contains(service)) {
            // New entity - persist
            entityManager.persist(service);
            entityManager.flush(); // Ensure ID is generated
            return service;
        } else {
            // Existing entity - merge
            return entityManager.merge(service);
        }
    }

    @Override
    public List<Service> findAll() {
        TypedQuery<Service> query = entityManager.createQuery("SELECT s FROM Service s ORDER BY s.serviceCode", Service.class);
        return query.getResultList();
    }

    @Override
    public Optional<Service> findByServiceCode(String serviceCode) {
        TypedQuery<Service> query = entityManager.createQuery(
            "SELECT s FROM Service s WHERE s.serviceCode = :serviceCode", Service.class);
        query.setParameter("serviceCode", serviceCode);
        try {
            Service service = query.getSingleResult();
            return Optional.of(service);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Service> findByServiceTypeID(int serviceTypeID) {
        TypedQuery<Service> query = entityManager.createQuery(
            "SELECT s FROM Service s WHERE s.serviceTypeID = :serviceTypeID ORDER BY s.serviceCode", Service.class);
        query.setParameter("serviceTypeID", serviceTypeID);
        return query.getResultList();
    }

    @Override
    public List<Service> findByStatus(String status) {
        TypedQuery<Service> query = entityManager.createQuery(
            "SELECT s FROM Service s WHERE s.status = :status ORDER BY s.serviceCode", Service.class);
        query.setParameter("status", status);
        return query.getResultList();
    }
}

