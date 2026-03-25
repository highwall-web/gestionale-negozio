package com.hgw.gestionale.product.entity;

import com.hgw.gestionale.color.entity.Color;
import com.hgw.gestionale.model.entity.Model;
import com.hgw.gestionale.repair.entity.Repair;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_id", nullable = true)
    private Repair repair;

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

    @Column
    private String codiceModello;
}
