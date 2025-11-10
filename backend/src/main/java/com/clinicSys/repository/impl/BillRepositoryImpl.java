package com.clinicSys.repository.impl;

import com.clinicSys.domain.Bill;
import com.clinicSys.repository.IBillRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class BillRepositoryImpl implements IBillRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Bill> findById(int id) {
        Bill bill = entityManager.find(Bill.class, id);
        return Optional.ofNullable(bill);
    }

    @Override
    public Bill save(Bill bill) {
        if (bill.getBillID() == 0 || !entityManager.contains(bill)) {
            entityManager.persist(bill);
            entityManager.flush();
            return bill;
        } else {
            return entityManager.merge(bill);
        }
    }

    @Override
    public List<Bill> findAll() {
        TypedQuery<Bill> query = entityManager.createQuery("SELECT b FROM Bill b", Bill.class);
        return query.getResultList();
    }

    @Override
    public BigDecimal getTotalRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<BigDecimal> query = entityManager.createQuery(
            "SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b " +
            "WHERE b.dateIssued >= :startDate AND b.dateIssued < :endDate AND b.paymentStatus = 'Paid'", 
            BigDecimal.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        BigDecimal result = query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }
}

