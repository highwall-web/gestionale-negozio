package com.hgw.gestionale.model.mapper;

import com.hgw.gestionale.brand.entity.Brand;
import com.hgw.gestionale.model.dto.CreateModelRequest;
import com.hgw.gestionale.model.dto.ModelResponse;
import com.hgw.gestionale.model.dto.UpdateModelRequest;
import com.hgw.gestionale.model.entity.Model;

public final class ModelMapper {
    private ModelMapper() {}

    public static Model toEntity(CreateModelRequest request, Brand brand) {
        return Model.builder()
                .nome(request.nome())
                .tipoDispositivo(request.tipoDispositivo())
                .brand(brand)
                .build();
    }

    public static ModelResponse toResponse(Model model) {
        return new ModelResponse(
                model.getId(),
                model.getNome(),
                model.getTipoDispositivo(),
                model.getBrand().getId(),
                model.getBrand().getNome()
        );
    }

    public static void updateEntity(Model model, UpdateModelRequest request, Brand brand) {
        model.setNome(request.nome());
        model.setTipoDispositivo(request.tipoDispositivo());
        model.setBrand(brand);
    }
}
