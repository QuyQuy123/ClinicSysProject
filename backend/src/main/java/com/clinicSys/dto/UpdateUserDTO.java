package com.clinicSys.dto;

public record UpdateUserDTO(
    String fullName,
    Integer roleID,
    String status
) {}

