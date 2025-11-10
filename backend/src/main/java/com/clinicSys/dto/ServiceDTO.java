package com.clinicSys.dto;

import java.math.BigDecimal;

public record ServiceDTO(
    int serviceID,
    String serviceCode,
    String serviceName,
    String serviceTypeName,
    int serviceTypeID,
    BigDecimal price,
    String status
) {}

