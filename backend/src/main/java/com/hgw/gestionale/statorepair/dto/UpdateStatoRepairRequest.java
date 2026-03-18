package com.hgw.gestionale.statorepair.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateStatoRepairRequest(
        @NotNull List<StatoRepairItem> stati
) {
    public record StatoRepairItem(
            @NotNull Long id,
            @NotBlank String nome,
            @NotBlank String colore,
            @NotNull Integer position
    ) {}
}
