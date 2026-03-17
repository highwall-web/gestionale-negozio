package com.hgw.gestionale.color.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateColorRequest(
        @NotBlank String nome
) {
}
