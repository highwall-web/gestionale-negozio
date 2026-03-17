package com.hgw.gestionale.product.service;

import com.hgw.gestionale.brand.entity.Brand;
import com.hgw.gestionale.brand.repository.BrandRepository;
import com.hgw.gestionale.color.entity.Color;
import com.hgw.gestionale.color.repository.ColorRepository;
import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.model.entity.Model;
import com.hgw.gestionale.model.repository.ModelRepository;
import com.hgw.gestionale.product.dto.CreateProductRequest;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.product.dto.UpdateProductRequest;
import com.hgw.gestionale.product.entity.Product;
import com.hgw.gestionale.product.mapper.ProductMapper;
import com.hgw.gestionale.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ModelRepository modelRepository;
    private final ColorRepository colorRepository;
    private final BrandRepository brandRepository;

    public ProductResponse create(CreateProductRequest request) {
        Model model = getOrCreateModel(request.brandNome(), request.modelNome());
        Color color = getOrCreateColor(request.colorNome());

        Product saved = productRepository.save(ProductMapper.toEntity(request, model, color));
        return ProductMapper.toResponse(saved);
    }

    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return ProductMapper.toResponse(product);
    }

    public ProductResponse getBySeriale(String seriale) {
        Product product = productRepository.findBySeriale(seriale)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return ProductMapper.toResponse(product);
    }

    public ProductResponse getByImei(String imei) {
        Product product = productRepository.findByImei(imei)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return ProductMapper.toResponse(product);
    }

    public List<ProductResponse> search(String modelNome) {
        return productRepository.findTop10ByModelNomeContainingIgnoreCase(modelNome)
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    public ProductResponse update(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        Model model = getOrCreateModel(request.brandNome(), request.modelNome());
        Color color = getOrCreateColor(request.colorNome());

        ProductMapper.updateEntity(product, request, model, color);
        Product updated = productRepository.save(product);

        return ProductMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        productRepository.deleteById(product.getId());
    }

    private Brand getOrCreateBrand(String brandNome) {
        return brandRepository.findByNomeIgnoreCase(brandNome)
                .orElseGet(() -> brandRepository.save(Brand.builder()
                        .nome(brandNome)
                        .build()));
    }

    private Model getOrCreateModel(String brandNome, String modelNome) {
        Brand brand = getOrCreateBrand(brandNome);
        return modelRepository.findByNomeIgnoreCase(modelNome)
                .orElseGet(() -> modelRepository.save(Model.builder()
                        .nome(modelNome)
                        .brand(brand)
                        .build()));
    }

    private Color getOrCreateColor(String colorNome) {
        return colorRepository.findByNomeIgnoreCase(colorNome)
                .orElseGet(() -> colorRepository.save(Color.builder()
                        .nome(colorNome)
                        .build()));
    }
}
