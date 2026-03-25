package com.hgw.gestionale.model.dto;

import com.hgw.gestionale.model.entity.TipoDispositivo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ModelResponse(
        @NotBlank Long id,
        @NotBlank String nome,
        @NotNull TipoDispositivo tipoDispositivo,
        @NotNull Long brandId,
        @NotBlank String brandNome
) {
}
