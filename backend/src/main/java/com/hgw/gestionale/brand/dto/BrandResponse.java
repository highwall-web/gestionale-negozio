package com.hgw.gestionale.brand.dto;

import jakarta.validation.constraints.NotBlank;

public record BrandResponse(
        @NotBlank Long id,
        @NotBlank String nome
) {
}
