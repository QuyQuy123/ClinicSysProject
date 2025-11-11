package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PrescriptionID")
    private int prescriptionID;

    @Column(name = "PrescriptionCode", unique = true, nullable = false)
    private String prescriptionCode;

    @Column(name = "Date", nullable = false)
    private LocalDateTime date;

    @Column(name = "Notes")
    private String notes;

    @Column(name = "AIAlerts")
    private String aiAlerts;

    @Column(name = "RecordID", nullable = false)
    private int recordID;

    @Column(name = "CreatedBy", nullable = false)
    private int createdBy;
}

