package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AppointmentID")
    private int appointmentID;

    @Column(name = "DateTime", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "Status", nullable = false)
    private String status;

    @Column(name = "PatientID", nullable = false)
    private int patientID;

    @Column(name = "DoctorID", nullable = false)
    private int doctorID;

    @Column(name = "ReceptionistID", nullable = false)
    private int receptionistID;
}

