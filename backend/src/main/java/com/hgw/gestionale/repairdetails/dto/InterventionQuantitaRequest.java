package com.hgw.gestionale.repairdetails.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InterventionQuantitaRequest(
        @NotNull Long interventionId,
        @Min(1) int quantita
) {
}
