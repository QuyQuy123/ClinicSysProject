package com.clinicSys.repository;

import com.clinicSys.domain.User;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity operations.
 * Follows the repository pattern as specified in the UML diagram.
 */
public interface IUserRepository {
    
    /**
     * Finds a user by ID
     * @param id User ID
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findById(int id);
    
    /**
     * Saves or updates a user entity
     * @param user User entity to save
     * @return Saved user entity
     */
    User save(User user);
    
    /**
     * Retrieves all users
     * @return List of all users
     */
    List<User> findAll();
    
    /**
     * Finds a user by username
     * @param username Username to search for
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Counts users by role ID
     * @param roleID Role ID to count
     * @return Number of users with the specified role
     */
    Long countByRole(int roleID);
    
    /**
     * Counts users by status
     * @param status Status to count
     * @return Number of users with the specified status
     */
    Long countByStatus(String status);
    
    /**
     * Counts all users
     * @return Total number of users
     */
    Long count();
    
    /**
     * Finds all users by role ID
     * @param roleID Role ID (2 for Doctor)
     * @return List of users with the specified role
     */
    List<User> findByRole(int roleID);
}