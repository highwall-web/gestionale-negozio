package com.hgw.gestionale.model.dto;

import com.hgw.gestionale.model.entity.TipoDispositivo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateModelRequest(
        @NotBlank String nome,
        @NotNull TipoDispositivo tipoDispositivo,
        @NotBlank String brandNome
) {
}
