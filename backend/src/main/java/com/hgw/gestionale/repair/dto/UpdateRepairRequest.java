package com.hgw.gestionale.repair.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateRepairRequest(
        @NotNull Long customerId,
        Long statoId,
        Long statoRiparazioneId
) {
}
