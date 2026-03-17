package com.hgw.gestionale.product.entity;

import com.hgw.gestionale.color.entity.Color;
import com.hgw.gestionale.model.entity.Model;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @Column
    private String capacita;

    @Column
    private String codiceUnlock;

    @Column(columnDefinition = "TEXT")
    private String sequenzaUnlock;

    @Column
    private String pin;

    @Column
    private String accessori;

    @Column
    private Boolean contattoConLiquidi;

    @Column
    private Boolean dispositivoNonTestabile;

    @Column
    private Boolean acquistatoPressoDiNoi;

    @Column
    private String seriale;

    @Column
    private String imei;
}
