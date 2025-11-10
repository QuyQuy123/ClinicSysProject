package com.clinicSys.repository.impl;

import com.clinicSys.domain.Appointment;
import com.clinicSys.repository.IAppointmentRepository;
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
public class AppointmentRepositoryImpl implements IAppointmentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Appointment> findById(int id) {
        Appointment appointment = entityManager.find(Appointment.class, id);
        return Optional.ofNullable(appointment);
    }

    @Override
    public Appointment save(Appointment appointment) {
        if (appointment.getAppointmentID() == 0 || !entityManager.contains(appointment)) {
            // New entity - persist
            entityManager.persist(appointment);
            entityManager.flush(); // Ensure ID is generated
            return appointment;
        } else {
            // Existing entity - merge
            return entityManager.merge(appointment);
        }
    }

    @Override
    public List<Appointment> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end) {
        TypedQuery<Appointment> query = entityManager.createQuery(
            "SELECT a FROM Appointment a WHERE a.dateTime >= :start AND a.dateTime < :end ORDER BY a.dateTime", 
            Appointment.class);
        query.setParameter("start", start);
        query.setParameter("end", end);
        return query.getResultList();
    }

    @Override
    public Long countByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.dateTime >= :startDate AND a.dateTime < :endDate", Long.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        Long result = query.getSingleResult();
        return result != null ? result : 0L;
    }
}

