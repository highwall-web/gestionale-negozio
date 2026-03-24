package com.hgw.gestionale.repairdetails.dto;

import jakarta.validation.constraints.NotBlank;

public record AddMessageRequest(
        @NotBlank
        String testo
) {
}
