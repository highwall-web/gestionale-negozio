package com.hgw.gestionale.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateModelRequest(
        @NotBlank String nome,
        @NotNull Long brandId
) {
}
