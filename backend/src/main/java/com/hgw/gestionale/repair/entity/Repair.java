package com.hgw.gestionale.repair.entity;

import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.product.entity.Product;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;

import jakarta.persistence.*;
import lombok.*;

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

    @OneToOne(mappedBy = "repair", fetch = FetchType.LAZY)
    private Product product;

    @OneToOne(mappedBy = "repair", fetch = FetchType.LAZY)
    private RepairDetails details;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stato_id")
    private StatoRepair stato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stato_riparazione_id")
    private StatoRiparazione statoRiparazione;
}
