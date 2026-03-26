package com.hgw.gestionale.intervention.repository;

import com.hgw.gestionale.intervention.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    Optional<Intervention> findByNomeIgnoreCaseAndAttivoTrue(String nome);
    List<Intervention> findByAttivoTrue();
    List<Intervention> findTop10ByNomeContainingIgnoreCaseAndAttivoTrue(String nome);
    List<Intervention> findByModelIsNullAndAttivoTrue();
    List<Intervention> findByModelIdAndAttivoTrue(Long modelId);
    List<Intervention> findTop10ByModelIdAndNomeContainingIgnoreCaseAndAttivoTrue(Long modelId, String nome);
}
