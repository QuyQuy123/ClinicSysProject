package com.clinicSys.dto.response;

import java.time.LocalDate;

public record PatientDTO(
    int patientID,
    String patientCode,
    String fullName,
    LocalDate dateOfBirth,
    String gender,
    String address,
    String phone,
    String email
) {}

