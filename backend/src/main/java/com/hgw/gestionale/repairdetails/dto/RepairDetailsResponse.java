package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RepairDetailsResponse(
        Long id,
        Long repairId,
        boolean isPreventivo,
        List<Long> interventions,
        LocalDate dataConsegna,
        BigDecimal acconto,
        List<RepairMessageResponse> messaggi
) {
}
