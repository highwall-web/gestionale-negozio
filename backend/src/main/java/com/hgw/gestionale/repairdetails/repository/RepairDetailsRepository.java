package com.hgw.gestionale.repairdetails.repository;

import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepairDetailsRepository extends JpaRepository<RepairDetails, Long> {
    Optional<RepairDetails> findByRepairId(Long repairId);
    boolean existsByRepairId(Long repairId);
}
