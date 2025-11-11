package com.clinicSys.dto.request;

import java.math.BigDecimal;

public record CreateServiceDTO(
    String serviceCode,
    int serviceTypeID,
    String serviceName,
    BigDecimal price,
    String status
) {}



