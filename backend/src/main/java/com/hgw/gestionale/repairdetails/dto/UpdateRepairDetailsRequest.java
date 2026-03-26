package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record UpdateRepairDetailsRequest(
        boolean isPreventivo,
        List<InterventionQuantitaRequest> interventi,
        LocalDate dataConsegna,
        BigDecimal acconto
) {
}
