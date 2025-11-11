package com.clinicSys.dto.request;

public record CreateUserDTO(
        String fullName,
        String email,
        int roleID
) {}



