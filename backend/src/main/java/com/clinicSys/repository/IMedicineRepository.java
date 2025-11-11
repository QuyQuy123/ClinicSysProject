package com.clinicSys.repository;

import com.clinicSys.domain.Medicine;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Medicine entity operations.
 */
public interface IMedicineRepository {
    
    Optional<Medicine> findById(int id);
    
    Medicine save(Medicine medicine);
    
    List<Medicine> findAll();
    
    Optional<Medicine> findByMedicineCode(String medicineCode);
    
    List<Medicine> findByMedicineGroupID(int medicineGroupID);
    
    List<Medicine> findByStatus(String status);
    
    List<Medicine> searchByName(String searchTerm);
}

