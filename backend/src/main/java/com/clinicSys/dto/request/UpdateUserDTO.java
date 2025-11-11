package com.clinicSys.dto.request;

public record UpdateUserDTO(
    String fullName,
    Integer roleID,
    String status
) {}



