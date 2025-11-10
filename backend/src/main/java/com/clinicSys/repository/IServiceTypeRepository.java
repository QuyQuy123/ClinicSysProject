package com.clinicSys.repository;

import com.clinicSys.domain.ServiceType;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ServiceType entity operations.
 */
public interface IServiceTypeRepository {
    
    Optional<ServiceType> findById(int id);
    
    List<ServiceType> findAll();
    
    List<ServiceType> findByStatus(String status);
}

