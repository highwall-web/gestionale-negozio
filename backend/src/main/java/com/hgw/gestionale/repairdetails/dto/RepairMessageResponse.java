package com.hgw.gestionale.repairdetails.dto;

import java.time.LocalDateTime;

public record RepairMessageResponse(
        Long id,
        String testo,
        String autore,
        LocalDateTime createdAt
) {
}
