package com.hgw.gestionale.repairdetails.entity;

import com.hgw.gestionale.intervention.entity.Intervention;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "repair_details_interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairDetailsIntervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_details_id", nullable = false)
    private RepairDetails repairDetails;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "intervention_id", nullable = false)
    private Intervention intervention;

    @Column(nullable = false)
    private int quantita;
}
