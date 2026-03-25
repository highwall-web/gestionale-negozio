package com.hgw.gestionale.product.dto;

import com.hgw.gestionale.color.dto.ColorResponse;
import com.hgw.gestionale.model.dto.ModelResponse;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ProductResponse(
        @NotNull Long id,
        @NotNull ModelResponse model,
        @NotNull ColorResponse color,
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
        String codiceModello
) {
}
