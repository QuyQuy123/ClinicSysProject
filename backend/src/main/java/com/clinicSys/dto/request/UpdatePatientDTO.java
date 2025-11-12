package com.clinicSys.dto.request;

import java.time.LocalDate;

public record UpdatePatientDTO(
    String fullName,
    LocalDate dateOfBirth,
    String gender,
    String address,
    String phone,
    String email
) {}

