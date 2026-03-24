package com.hgw.gestionale.model.repository;

import com.hgw.gestionale.model.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    List<Model> findByBrandId(Long brandId);

    Optional<Model> findByNomeIgnoreCase(String nome);

    Optional<Model> findByNomeIgnoreCaseAndBrandNomeIgnoreCase(String nome, String brandNome);

    List<Model> findTop10ByNomeContainingIgnoreCase(String nome);

    List<Model> findTop10ByBrandIdAndNomeContainingIgnoreCase(Long brandId, String nome);

    List<Model> findTop10ByBrandNomeContainingIgnoreCaseAndNomeContainingIgnoreCase(String brandNome, String nome);
}
