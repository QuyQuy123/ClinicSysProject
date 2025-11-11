package com.clinicSys.dto.response;

/**
 * DTO for ICD10Code
 */
public record ICD10CodeDTO(
    int codeID,
    String code,
    String description
) {}

