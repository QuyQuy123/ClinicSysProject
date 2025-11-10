package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "[Service]")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    private int serviceID;

    @Column(name = "ServiceCode", unique = true, nullable = false)
    private String serviceCode;

    @Column(name = "ServiceTypeID", nullable = false)
    private int serviceTypeID;

    @Column(name = "Name", unique = true, nullable = false)
    private String name;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Column(name = "Status", nullable = false)
    private String status;
}

