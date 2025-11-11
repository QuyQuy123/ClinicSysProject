package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MedicalRecord")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecordID")
    private int recordID;

    @Column(name = "Vitals")
    private String vitals;

    @Column(name = "Symptoms")
    private String symptoms;

    @Column(name = "Notes")
    private String notes;

    @Column(name = "AppointmentID", unique = true, nullable = false)
    private int appointmentID;

    @Column(name = "CreatedBy", nullable = false)
    private int createdBy;

    @Column(name = "ModifiedBy")
    private Integer modifiedBy;
}

