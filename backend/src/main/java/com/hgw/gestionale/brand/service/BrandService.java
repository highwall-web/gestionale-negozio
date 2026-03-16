package com.hgw.gestionale.brand.service;

import com.hgw.gestionale.brand.dto.BrandResponse;
import com.hgw.gestionale.brand.dto.CreateBrandRequest;
import com.hgw.gestionale.brand.dto.UpdateBrandRequest;
import com.hgw.gestionale.brand.entity.Brand;
import com.hgw.gestionale.brand.mapper.BrandMapper;
import com.hgw.gestionale.brand.repository.BrandRepository;
import com.hgw.gestionale.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    public BrandResponse create(CreateBrandRequest request) {
        Brand saved = brandRepository.save(BrandMapper.toEntity(request));
        return BrandMapper.toResponse(saved);
    }

    public List<BrandResponse> getAll() {
        return brandRepository.findAll().stream()
                .map(BrandMapper::toResponse)
                .toList();
    }

    public BrandResponse getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand not found"));
        return BrandMapper.toResponse(brand);
    }

    public BrandResponse getByName(String nome) {
        Brand brand = brandRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new NotFoundException("Brand not found"));
        return BrandMapper.toResponse(brand);
    }

    public List<BrandResponse> search(String nome) {
        return brandRepository.findTop10ByNomeContainingIgnoreCase(nome)
                .stream()
                .map(BrandMapper::toResponse)
                .toList();
    }

    public BrandResponse update(Long id, UpdateBrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand not found"));

        BrandMapper.updateEntity(brand, request);
        Brand updated = brandRepository.save(brand);

        return BrandMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand not found"));

        brandRepository.deleteById(brand.getId());
    }
}
