package com.clinicSys.repository;

import com.clinicSys.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Integer> {
    // Phương thức quan trọng để Spring Security tìm user
    Optional<User> findByUsername(String username);
}