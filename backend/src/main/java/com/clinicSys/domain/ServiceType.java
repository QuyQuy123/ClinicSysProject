package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ServiceType")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceTypeID")
    private int serviceTypeID;

    @Column(name = "TypeName", unique = true, nullable = false)
    private String typeName;

    @Column(name = "Status", nullable = false)
    private String status;
}

