package com.hgw.gestionale.statoriparazione.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StatoRiparazioneResponse(
        @NotNull Long id,
        @NotBlank String nome,
        @NotBlank String colore,
        @NotNull Integer position
) {
}
