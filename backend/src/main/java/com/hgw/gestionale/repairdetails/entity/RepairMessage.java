package com.hgw.gestionale.repairdetails.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "repair_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_details_id", nullable = false)
    private RepairDetails repairDetails;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String testo;

    @Column(nullable = false)
    private String autore;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
