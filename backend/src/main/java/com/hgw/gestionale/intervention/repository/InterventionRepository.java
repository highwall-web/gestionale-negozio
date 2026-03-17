package com.hgw.gestionale.intervention.repository;

import com.hgw.gestionale.intervention.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    Optional<Intervention> findByNomeIgnoreCase(String nome);
    List<Intervention> findTop10ByNomeContainingIgnoreCase(String nome);
}
