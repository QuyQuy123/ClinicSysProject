package com.clinicSys.dto.response;

// DTO để hiển thị danh sách Staff
public record UserDTO(
        int userID,
        String fullName,
        String email,
        String roleName,
        String status
) {}



