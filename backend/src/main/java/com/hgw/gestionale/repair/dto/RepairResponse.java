package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.repair.entity.Tariffa;
import com.hgw.gestionale.statorepair.dto.StatoRepairResponse;
import com.hgw.gestionale.statoriparazione.dto.StatoRiparazioneResponse;

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
        StatoRepairResponse stato,
        StatoRiparazioneResponse statoRiparazione
) {
}
