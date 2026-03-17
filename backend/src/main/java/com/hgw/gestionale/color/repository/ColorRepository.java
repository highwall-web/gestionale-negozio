package com.hgw.gestionale.color.repository;

import com.hgw.gestionale.color.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
    Optional<Color> findByNomeIgnoreCase(String name);
    List<Color> findTop10ByNomeContainingIgnoreCase(String name);
}
