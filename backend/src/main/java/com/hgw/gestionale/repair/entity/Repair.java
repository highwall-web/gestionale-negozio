package com.hgw.gestionale.repair.entity;

import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repairs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(columnDefinition = "TEXT")
    private String interventionIds;

    @Column(columnDefinition = "TEXT")
    private String commenti;

    @Column
    private LocalDate dataConsegna;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tariffa tariffa;

    @Column
    private BigDecimal acconto;

    @Enumerated(EnumType.STRING)
    @Column
    private Stato stato;

    @Enumerated(EnumType.STRING)
    @Column
    private StatoRiparazione statoRiparazione;
}
