package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record RepairDetailsResponse(
        Long id,
        Long repairId,
        boolean isPreventivo,
        List<InterventionQuantitaResponse> interventi,
        LocalDateTime dataConsegna,
        LocalDateTime dataRiconsegnaEffettiva,
        BigDecimal acconto,
        List<RepairMessageResponse> messaggi
) {
}
