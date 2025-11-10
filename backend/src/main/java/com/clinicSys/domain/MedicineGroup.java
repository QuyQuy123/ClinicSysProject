package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MedicineGroup")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedicineGroupID")
    private int medicineGroupID;

    @Column(name = "Name", unique = true, nullable = false)
    private String name;

    @Column(name = "Status", nullable = false)
    private String status;
}

