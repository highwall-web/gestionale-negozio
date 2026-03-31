package com.hgw.gestionale.repairdetails.entity;

import com.hgw.gestionale.repair.entity.Repair;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "repairDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 30)
    @Builder.Default
    private List<RepairDetailsIntervention> interventions = new ArrayList<>();

    @Column
    private LocalDateTime dataConsegna;

    @Column
    private LocalDateTime dataRiconsegnaEffettiva;

    @Column
    private BigDecimal acconto;

    @OneToMany(mappedBy = "repairDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @BatchSize(size = 30)
    @Builder.Default
    private List<RepairMessage> messaggi = new ArrayList<>();
}
