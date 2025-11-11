package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ICD10Code")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ICD10Code {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CodeID")
    private int codeID;

    @Column(name = "Code", unique = true, nullable = false)
    private String code;

    @Column(name = "Description", nullable = false)
    private String description;
}

