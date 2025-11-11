package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Prescription_Medicine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionMedicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Prescription_MedicineID")
    private int prescriptionMedicineID;

    @Column(name = "PrescriptionID", nullable = false)
    private int prescriptionID;

    @Column(name = "MedicineID", nullable = false)
    private int medicineID;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "Note")
    private String note;
}

