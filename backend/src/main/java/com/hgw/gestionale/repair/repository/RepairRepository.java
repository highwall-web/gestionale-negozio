package com.hgw.gestionale.repair.repository;

import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {
    Page<Repair> findByStato(StatoRepair stato, Pageable pageable);
    Page<Repair> findByStatoRiparazione(StatoRiparazione statoRiparazione, Pageable pageable);
    Page<Repair> findByStatoAndStatoRiparazione(StatoRepair stato, StatoRiparazione statoRiparazione, Pageable pageable);
    boolean existsByStato(StatoRepair stato);
    boolean existsByStatoRiparazione(StatoRiparazione statoRiparazione);
}
