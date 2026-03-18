package com.hgw.gestionale.statoriparazione.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStatoRiparazioneRequest(
        @NotBlank String nome,
        @NotBlank String colore,
        @NotNull Integer position
) {
}
