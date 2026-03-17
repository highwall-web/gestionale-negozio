package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.repair.entity.Stato;
import com.hgw.gestionale.repair.entity.StatoRiparazione;
import com.hgw.gestionale.repair.entity.Tariffa;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RepairResponse(
        @NotNull Long id,
        @NotNull CustomerResponse customer,
        @NotNull ProductResponse product,
        List<InterventionResponse> interventions,
        String commenti,
        LocalDate dataConsegna,
        @NotNull Tariffa tariffa,
        BigDecimal acconto,
        Stato stato,
        StatoRiparazione statoRiparazione
) {
}
