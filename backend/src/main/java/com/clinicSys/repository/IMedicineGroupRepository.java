package com.clinicSys.repository;

import com.clinicSys.domain.MedicineGroup;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MedicineGroup entity operations.
 */
public interface IMedicineGroupRepository {
    
    Optional<MedicineGroup> findById(int id);
    
    List<MedicineGroup> findAll();
    
    List<MedicineGroup> findByStatus(String status);
}

