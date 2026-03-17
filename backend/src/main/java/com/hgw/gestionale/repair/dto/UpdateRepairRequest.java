package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.repair.entity.Stato;
import com.hgw.gestionale.repair.entity.StatoRiparazione;
import com.hgw.gestionale.repair.entity.Tariffa;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record UpdateRepairRequest(
        @NotNull Long customerId,
        @NotNull Long productId,
        List<Long> interventionIds,
        String commenti,
        LocalDate dataConsegna,
        @NotNull Tariffa tariffa,
        BigDecimal acconto,
        @NotNull Stato stato,
        @NotNull StatoRiparazione statoRiparazione
) {
}
