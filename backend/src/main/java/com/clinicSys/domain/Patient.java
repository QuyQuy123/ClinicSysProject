package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PatientID")
    private int patientID;

    @Column(name = "PatientCode", unique = true, nullable = false)
    private String patientCode;

    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Column(name = "DateOfBirth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "Gender", nullable = false)
    private String gender;

    @Column(name = "Address")
    private String address;

    @Column(name = "Phone", unique = true, nullable = false)
    private String phone;

    @Column(name = "Email", unique = true)
    private String email;
}

