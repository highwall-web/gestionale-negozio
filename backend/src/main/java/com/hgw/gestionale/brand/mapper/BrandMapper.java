package com.hgw.gestionale.brand.mapper;

import com.hgw.gestionale.brand.dto.BrandResponse;
import com.hgw.gestionale.brand.dto.CreateBrandRequest;
import com.hgw.gestionale.brand.dto.UpdateBrandRequest;
import com.hgw.gestionale.brand.entity.Brand;

public final class BrandMapper {
    private BrandMapper() {}

    public static Brand toEntity(CreateBrandRequest request) {
        return Brand.builder()
                .nome(request.nome())
                .build();
    }

    public static BrandResponse toResponse(Brand brand) {
        return new BrandResponse(
                brand.getId(),
                brand.getNome()
        );
    }

    public static void updateEntity(Brand brand, UpdateBrandRequest request) {
        brand.setNome(request.nome());
    }
}
