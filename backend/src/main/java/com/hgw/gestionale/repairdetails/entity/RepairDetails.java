package com.hgw.gestionale.repairdetails.entity;

import com.hgw.gestionale.repair.entity.Repair;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repair_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_id", nullable = false, unique = true)
    private Repair repair;

    @Column
    private boolean isPreventivo;

    @Column(columnDefinition = "TEXT")
    private String interventionIds;

    @Column(columnDefinition = "TEXT")
    private String commenti;

    @Column
    private LocalDate dataConsegna;

    @Column
    private BigDecimal acconto;
}
