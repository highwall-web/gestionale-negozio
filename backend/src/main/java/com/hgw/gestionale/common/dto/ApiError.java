package com.hgw.gestionale.common.dto;

import java.time.Instant;

public record ApiError(
        String message,
        Instant timestamp
) {
}
