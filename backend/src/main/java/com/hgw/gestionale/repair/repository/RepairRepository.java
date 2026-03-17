package com.hgw.gestionale.repair.repository;

import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repair.entity.Stato;
import com.hgw.gestionale.repair.entity.StatoRiparazione;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {
    Page<Repair> findByStato(Stato stato, Pageable pageable);
    Page<Repair> findByStatoRiparazione(StatoRiparazione statoRiparazione, Pageable pageable);
    Page<Repair> findByStatoAndStatoRiparazione(Stato stato, StatoRiparazione statoRiparazione, Pageable pageable);
}
