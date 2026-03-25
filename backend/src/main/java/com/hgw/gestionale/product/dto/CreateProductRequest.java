package com.hgw.gestionale.product.dto;

import java.util.List;

import com.hgw.gestionale.color.dto.CreateColorRequest;
import com.hgw.gestionale.model.dto.CreateModelRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record CreateProductRequest(
        @Valid @NotBlank CreateModelRequest model,
        @Valid @NotBlank CreateColorRequest color,
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
