package com.hgw.gestionale.product.dto;

import java.util.List;
import java.util.Map;

import com.hgw.gestionale.color.dto.CreateColorRequest;
import com.hgw.gestionale.model.dto.CreateModelRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateProductRequest(
        @Valid @NotNull CreateModelRequest model,
        @Valid @NotNull CreateColorRequest color,
        String capacita,
        String codiceUnlock,
        List<Integer> sequenzaUnlock,
        String pin,
        String accessori,
        Boolean contattoConLiquidi,
        Boolean dispositivoNonTestabile,
        Boolean acquistatoPressoDiNoi,
        String seriale,
        String imei,
        String codiceModello,
        Map<String, List<String>> testDiagnostici,
        Boolean lasciatoInNegozio
) {
}
