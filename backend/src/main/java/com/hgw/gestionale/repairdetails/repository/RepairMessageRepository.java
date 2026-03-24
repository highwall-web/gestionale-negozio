package com.hgw.gestionale.repairdetails.repository;

import com.hgw.gestionale.repairdetails.entity.RepairMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairMessageRepository extends JpaRepository<RepairMessage, Long> {
}
