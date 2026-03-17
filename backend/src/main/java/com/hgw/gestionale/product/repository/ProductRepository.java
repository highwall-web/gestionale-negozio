package com.hgw.gestionale.product.repository;

import com.hgw.gestionale.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySeriale(String seriale);
    Optional<Product> findByImei(String imei);
    List<Product> findTop10ByModelNomeContainingIgnoreCase(String modelNome);
}
