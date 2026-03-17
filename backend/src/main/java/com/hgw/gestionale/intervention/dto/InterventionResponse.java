package com.hgw.gestionale.intervention.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record InterventionResponse(
        @NotNull Long id,
        @NotBlank String nome,
        @NotNull BigDecimal prezzo,
        Integer periodoGaranzia
) {
}
