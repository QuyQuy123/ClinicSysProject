package com.clinicSys.dto;

public record CreateUserDTO(
        String fullName,
        String email,
        int roleID
) {}