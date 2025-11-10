package com.clinicSys.service.impl;

import com.clinicSys.domain.User;
import com.clinicSys.dto.CreateUserDTO;
import com.clinicSys.dto.UpdateUserDTO;
import com.clinicSys.dto.UpdateUserStatusDTO;
import com.clinicSys.dto.UserDTO;
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

    // (Giả sử bạn đã có IRoleRepository)
    // @Autowired
    // private IRoleRepository roleRepository;

    @Override
    public List<UserDTO> getAllStaff() {
        // Lấy tất cả User, chuyển đổi sang UserDTO
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO createStaff(CreateUserDTO userDTO) {
        // (Đây là logic đơn giản hóa, bạn nên kiểm tra email tồn tại, v.v.)

        User newUser = new User();
        newUser.setFullName(userDTO.fullName());
        newUser.setEmail(userDTO.email());
        newUser.setUsername(userDTO.email()); // Dùng email làm username
        newUser.setRole(userDTO.roleID());
        newUser.setStatus("Active"); // Đặt Active luôn

        // !!! Đặt mật khẩu mặc định (ĐÃ MÃ HÓA) !!!
        // VÌ BẠN ĐANG DÙNG NoOpPasswordEncoder, nên mật khẩu là text thuần
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
        // Reset về mật khẩu mặc định
        user.setPasswordHash("default123");
        userRepository.save(user);
    }

    // Hàm tiện ích để chuyển đổi Entity -> DTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserID(),
                user.getFullName(),
                user.getEmail(),
                user.getRoleString(), // Dùng hàm getRoleString() bạn đã viết
                user.getStatus()
        );
    }
}