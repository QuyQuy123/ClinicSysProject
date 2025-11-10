package com.clinicSys.repository;

import com.clinicSys.domain.Service;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Service entity operations.
 */
public interface IServiceRepository {
    
    Optional<Service> findById(int id);
    
    Service save(Service service);
    
    List<Service> findAll();
    
    Optional<Service> findByServiceCode(String serviceCode);
    
    List<Service> findByServiceTypeID(int serviceTypeID);
    
    List<Service> findByStatus(String status);
}

