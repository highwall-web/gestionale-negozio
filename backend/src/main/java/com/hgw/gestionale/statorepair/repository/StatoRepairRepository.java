package com.hgw.gestionale.statorepair.repository;

import com.hgw.gestionale.statorepair.entity.StatoRepair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatoRepairRepository extends JpaRepository<StatoRepair, Long> {
}
