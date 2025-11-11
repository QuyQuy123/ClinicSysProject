package com.clinicSys.dto.request;

import java.math.BigDecimal;

public record UpdateServiceDTO(
    String serviceName,
    Integer serviceTypeID,
    BigDecimal price,
    String status
) {}



