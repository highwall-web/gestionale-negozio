package com.hgw.gestionale.brand.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateBrandRequest(
        @NotBlank String nome
) {
}
