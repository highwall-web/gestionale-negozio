package com.hgw.gestionale.color.mapper;

import com.hgw.gestionale.color.dto.ColorResponse;
import com.hgw.gestionale.color.dto.CreateColorRequest;
import com.hgw.gestionale.color.dto.UpdateColorRequest;
import com.hgw.gestionale.color.entity.Color;

public final class ColorMapper {
    private ColorMapper() {}

    public static Color toEntity(CreateColorRequest request) {
        return Color.builder()
                .nome(request.nome())
                .build();
    }

    public static ColorResponse toResponse(Color color) {
        return new ColorResponse(
                color.getId(),
                color.getNome()
        );
    }

    public static void updateEntity(Color color, UpdateColorRequest request) {
        color.setNome(request.nome());
    }
}
