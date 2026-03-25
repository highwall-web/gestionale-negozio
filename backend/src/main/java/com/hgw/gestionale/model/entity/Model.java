package com.hgw.gestionale.model.entity;

import com.hgw.gestionale.brand.entity.Brand;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDispositivo tipoDispositivo;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

}
