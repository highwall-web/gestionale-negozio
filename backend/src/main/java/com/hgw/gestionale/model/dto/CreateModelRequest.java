package com.hgw.gestionale.model.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateModelRequest(
        @NotBlank String nome,
        @NotBlank String brandNome
) {
}
