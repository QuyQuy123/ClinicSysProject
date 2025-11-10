package com.clinicSys.repository.impl;

import com.clinicSys.domain.User;
import com.clinicSys.repository.IUserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class UserRepositoryImpl implements IUserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<User> findById(int id) {
        User user = entityManager.find(User.class, id);
        return Optional.ofNullable(user);
    }

    @Override
    public User save(User user) {
        if (user.getUserID() == 0 || !entityManager.contains(user)) {
            entityManager.persist(user);
            entityManager.flush();
            return user;
        } else {
            return entityManager.merge(user);
        }
    }

    @Override
    public List<User> findAll() {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        TypedQuery<User> query = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        try {
            User user = query.getSingleResult();
            return Optional.of(user);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public Long countByRole(int roleID) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(u) FROM User u WHERE u.role = :roleID", Long.class);
        query.setParameter("roleID", roleID);
        return query.getSingleResult();
    }

    @Override
    public Long countByStatus(String status) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(u) FROM User u WHERE u.status = :status", Long.class);
        query.setParameter("status", status);
        Long result = query.getSingleResult();
        return result != null ? result : 0L;
    }

    @Override
    public Long count() {
        TypedQuery<Long> query = entityManager.createQuery("SELECT COUNT(u) FROM User u", Long.class);
        Long result = query.getSingleResult();
        return result != null ? result : 0L;
    }
}

