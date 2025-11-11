package com.clinicSys.repository.impl;

import com.clinicSys.domain.ICD10Code;
import com.clinicSys.repository.IICD10CodeRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class ICD10CodeRepositoryImpl implements IICD10CodeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ICD10Code> findById(int id) {
        ICD10Code code = entityManager.find(ICD10Code.class, id);
        return Optional.ofNullable(code);
    }

    @Override
    public List<ICD10Code> searchByCodeOrDescription(String searchTerm) {
        TypedQuery<ICD10Code> query = entityManager.createQuery(
            "SELECT icd FROM ICD10Code icd " +
            "WHERE LOWER(icd.code) LIKE LOWER(:searchTerm) OR " +
            "LOWER(icd.description) LIKE LOWER(:searchTerm) " +
            "ORDER BY icd.code",
            ICD10Code.class);
        query.setParameter("searchTerm", "%" + searchTerm + "%");
        query.setMaxResults(50); // Limit results
        return query.getResultList();
    }
}
