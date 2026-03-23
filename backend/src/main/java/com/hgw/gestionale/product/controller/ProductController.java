package com.hgw.gestionale.product.controller;

import com.hgw.gestionale.product.dto.CreateProductRequest;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.product.dto.UpdateProductRequest;
import com.hgw.gestionale.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/products", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        log.info("ProductController.getAll richiesta lista product");
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        log.info("ProductController.getById richiesta product id={}", id);
        return productService.getById(id);
    }

    @GetMapping("/by-seriale/{seriale}")
    public ProductResponse getProductBySeriale(@PathVariable String seriale) {
        log.info("ProductController.getBySeriale richiesta product seriale={}", seriale);
        return productService.getBySeriale(seriale);
    }

    @GetMapping("/by-imei/{imei}")
    public ProductResponse getProductByImei(@PathVariable String imei) {
        log.info("ProductController.getByImei richiesta product imei={}", imei);
        return productService.getByImei(imei);
    }

    @GetMapping("/search")
    public List<ProductResponse> searchProduct(@RequestParam String modelNome) {
        log.info("ProductController.search ricerca product modelNome={}", modelNome);
        return productService.search(modelNome);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        log.info("ProductController.update aggiornamento product id={}", id);
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        log.info("ProductController.delete eliminazione product id={}", id);
        productService.delete(id);
    }
}
