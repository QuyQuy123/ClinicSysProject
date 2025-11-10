package com.clinicSys.dto;

import java.math.BigDecimal;

public record UpdateServiceDTO(
    String serviceName,
    Integer serviceTypeID,
    BigDecimal price,
    String status
) {}

