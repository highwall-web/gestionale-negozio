package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.statorepair.dto.StatoRepairResponse;
import com.hgw.gestionale.statoriparazione.dto.StatoRiparazioneResponse;

import jakarta.validation.constraints.NotNull;

public record RepairResponse(
        @NotNull Long id,
        @NotNull CustomerResponse customer,
        @NotNull ProductResponse product,
        RepairDetailsResponse details,
        StatoRepairResponse stato,
        StatoRiparazioneResponse statoRiparazione
) {
}
