package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record UpdateRepairDetailsRequest(
        boolean isPreventivo,
        List<InterventionQuantitaRequest> interventi,
        LocalDateTime dataConsegna,
        BigDecimal acconto
) {
}
