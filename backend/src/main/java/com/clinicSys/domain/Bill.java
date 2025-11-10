package com.clinicSys.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bill")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BillID")
    private int billID;

    @Column(name = "InvoiceCode", unique = true, nullable = false)
    private String invoiceCode;

    @Column(name = "TotalAmount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "PaymentStatus", nullable = false)
    private String paymentStatus;

    @Column(name = "AppointmentID", unique = true, nullable = false)
    private int appointmentID;

    @Column(name = "PaymentMethodID")
    private Integer paymentMethodID;

    @Column(name = "DateIssued", nullable = false)
    private LocalDateTime dateIssued;

    @Column(name = "DatePaid")
    private LocalDateTime datePaid;
}

