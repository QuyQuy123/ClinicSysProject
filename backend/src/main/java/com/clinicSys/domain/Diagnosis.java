package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Diagnosis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiagnosisID")
    private int diagnosisID;

    @Column(name = "Description")
    private String description;

    @Column(name = "Date", nullable = false)
    private LocalDateTime date;

    @Column(name = "RecordID", nullable = false)
    private int recordID;

    @Column(name = "ICD10CodeID", nullable = false)
    private int icd10CodeID;

    @Column(name = "CreatedBy", nullable = false)
    private int createdBy;
}

