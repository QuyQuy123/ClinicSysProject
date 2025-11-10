package com.clinicSys.dto;

import java.math.BigDecimal;

public record CreateServiceDTO(
    String serviceCode,
    int serviceTypeID,
    String serviceName,
    BigDecimal price,
    String status
) {}

