package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;

public record InterventionQuantitaResponse(
        Long interventionId,
        String nome,
        BigDecimal prezzo,
        int quantita
) {
}
