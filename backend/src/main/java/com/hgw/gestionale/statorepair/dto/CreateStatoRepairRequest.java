package com.hgw.gestionale.statorepair.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStatoRepairRequest(
        @NotBlank String nome,
        @NotBlank String colore,
        @NotNull Integer position
) {
}
