package com.hgw.gestionale.product.dto;

import com.hgw.gestionale.color.dto.ColorResponse;
import com.hgw.gestionale.model.dto.ModelResponse;

import java.util.List;

public record ProductResponse(
        Long id,
        ModelResponse model,
        ColorResponse color,
        String capacita,
        String codiceUnlock,
        List<Integer> sequenzaUnlock,
        String pin,
        String accessori,
        Boolean contattoConLiquidi,
        Boolean dispositivoNonTestabile,
        Boolean acquistatoPressoDiNoi,
        String seriale,
        String imei
) {
}
