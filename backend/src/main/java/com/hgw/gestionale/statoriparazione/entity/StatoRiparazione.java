package com.hgw.gestionale.statoriparazione.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stato_riparazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatoRiparazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String colore;

    @Column(nullable = false)
    private Integer position;
}
