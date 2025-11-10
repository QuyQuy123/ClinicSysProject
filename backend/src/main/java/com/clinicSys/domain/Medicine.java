package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Medicine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedicineID")
    private int medicineID;

    @Column(name = "MedicineCode", unique = true, nullable = false)
    private String medicineCode;

    @Column(name = "MedicineGroupID", nullable = false)
    private int medicineGroupID;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Strength")
    private String strength;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Column(name = "Stock", nullable = false)
    private int stock;

    @Column(name = "Status", nullable = false)
    private String status;
    
    // Note: Unit field may need to be added to the database
    // ALTER TABLE Medicine ADD Unit NVARCHAR(50);
    @Column(name = "Unit")
    private String unit;
}

