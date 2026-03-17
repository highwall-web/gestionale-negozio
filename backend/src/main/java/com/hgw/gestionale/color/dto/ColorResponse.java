package com.hgw.gestionale.color.dto;

import jakarta.validation.constraints.NotBlank;

public record ColorResponse(
        @NotBlank Long id,
        @NotBlank String nome
) {
}
