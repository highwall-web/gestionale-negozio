package com.hgw.gestionale.brand.repository;

import com.hgw.gestionale.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByNomeIgnoreCase(String name);
    List<Brand> findTop10ByNomeContainingIgnoreCase(String name);
}
