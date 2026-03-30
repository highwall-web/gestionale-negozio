package com.hgw.gestionale.intervention.entity;

import com.hgw.gestionale.model.entity.Model;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = true)
    private Model model;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal prezzo;

    private Integer periodoGaranzia;

    @Column(nullable = false)
    @Builder.Default
    private boolean attivo = true;
}
