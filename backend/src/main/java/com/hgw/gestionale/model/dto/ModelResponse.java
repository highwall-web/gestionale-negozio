package com.hgw.gestionale.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ModelResponse(
        @NotBlank Long id,
        @NotBlank String nome,
        @NotNull Long brandId,
        @NotBlank String brandNome
) {
}
