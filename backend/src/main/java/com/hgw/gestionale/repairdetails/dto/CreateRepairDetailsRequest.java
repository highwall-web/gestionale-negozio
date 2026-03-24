package com.hgw.gestionale.repairdetails.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CreateRepairDetailsRequest(
        boolean isPreventivo,
        List<Long> interventionIds,
        LocalDate dataConsegna,
        BigDecimal acconto,
        List<AddMessageRequest> messaggi
) {
}
