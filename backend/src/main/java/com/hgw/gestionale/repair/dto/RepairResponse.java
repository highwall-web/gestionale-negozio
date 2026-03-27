package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.statorepair.StatoRepair;
import com.hgw.gestionale.statoriparazione.StatoRiparazione;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RepairResponse(
        @NotNull Long id,
        @NotNull CustomerResponse customer,
        @NotNull ProductResponse product,
        RepairDetailsResponse details,
        StatoRepair stato,
        StatoRiparazione statoRiparazione,
        BigDecimal costoTotale,
        LocalDateTime createdAt
) {
}
