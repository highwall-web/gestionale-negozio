package com.hgw.gestionale.repairdetails.repository;

import com.hgw.gestionale.repairdetails.entity.RepairDetailsIntervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairDetailsInterventionRepository extends JpaRepository<RepairDetailsIntervention, Long> {
    void deleteByRepairDetailsId(Long repairDetailsId);
}
