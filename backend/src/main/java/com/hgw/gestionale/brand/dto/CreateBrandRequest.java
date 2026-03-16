package com.hgw.gestionale.brand.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateBrandRequest(
        @NotBlank String nome
) {
}
