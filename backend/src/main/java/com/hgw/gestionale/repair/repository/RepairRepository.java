package com.hgw.gestionale.repair.repository;

import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.statorepair.StatoRepair;
import com.hgw.gestionale.statoriparazione.StatoRiparazione;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {
    Page<Repair> findByStato(StatoRepair stato, Pageable pageable);
    Page<Repair> findByStatoRiparazione(StatoRiparazione statoRiparazione, Pageable pageable);
    Page<Repair> findByStatoAndStatoRiparazione(StatoRepair stato, StatoRiparazione statoRiparazione, Pageable pageable);

    @Query("SELECT r FROM Repair r " +
           "LEFT JOIN FETCH r.customer " +
           "LEFT JOIN FETCH r.product " +
           "LEFT JOIN FETCH r.details " +
           "WHERE r.stato <> :stato")
    List<Repair> findByStatoNotWithDetails(@Param("stato") StatoRepair stato);
}
