package com.clinicSys.repository;

import com.clinicSys.domain.Bill;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Bill entity operations.
 * Follows the repository pattern as specified in the UML diagram.
 */
public interface IBillRepository {
    
    /**
     * Finds a bill by ID
     * @param id Bill ID
     * @return Optional containing the bill if found, empty otherwise
     */
    Optional<Bill> findById(int id);
    
    /**
     * Saves or updates a bill entity
     * @param bill Bill entity to save
     * @return Saved bill entity
     */
    Bill save(Bill bill);
    
    /**
     * Retrieves all bills
     * @return List of all bills
     */
    List<Bill> findAll();
    
    /**
     * Gets total revenue by date range (only paid bills)
     * @param startDate Start date
     * @param endDate End date
     * @return Total revenue amount
     */
    BigDecimal getTotalRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate);
}

