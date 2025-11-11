package com.clinicSys.service.impl;

import com.clinicSys.domain.User;
import com.clinicSys.dto.request.CreateUserDTO;
import com.clinicSys.dto.request.UpdateUserDTO;
import com.clinicSys.dto.request.UpdateUserStatusDTO;
import com.clinicSys.dto.response.UserDTO;
import com.clinicSys.repository.IUserRepository;
import com.clinicSys.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public List<UserDTO> getAllStaff() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO createStaff(CreateUserDTO userDTO) {
        User newUser = new User();
        newUser.setFullName(userDTO.fullName());
        newUser.setEmail(userDTO.email());
        newUser.setUsername(userDTO.email());
        newUser.setRole(userDTO.roleID());
        newUser.setStatus("Active");
        newUser.setPasswordHash("default123");

        User savedUser = userRepository.save(newUser);
        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO getStaffById(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return convertToDTO(userOpt.get());
    }

    @Override
    public UserDTO updateStaff(int userId, UpdateUserDTO updateDTO) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        
        if (updateDTO.fullName() != null && !updateDTO.fullName().isEmpty()) {
            user.setFullName(updateDTO.fullName());
        }
        
        if (updateDTO.roleID() != null) {
            user.setRole(updateDTO.roleID());
        }
        
        if (updateDTO.status() != null && !updateDTO.status().isEmpty()) {
            user.setStatus(updateDTO.status());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public UserDTO updateStaffStatus(int userId, UpdateUserStatusDTO updateDTO) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        user.setStatus(updateDTO.status());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public void resetPassword(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        user.setPasswordHash("default123");
        userRepository.save(user);
    }
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserID(),
                user.getFullName(),
                user.getEmail(),
                user.getRoleString(),
                user.getStatus()
        );
    }
}