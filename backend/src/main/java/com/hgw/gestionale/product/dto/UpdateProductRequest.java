package com.hgw.gestionale.product.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record UpdateProductRequest(
        @NotBlank String brandNome,
        @NotBlank String modelNome,
        @NotBlank String colorNome,
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
        String tipoDispositivo
) {
}
