package com.hgw.gestionale.statoriparazione.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateStatoRiparazioneRequest(
        @NotNull List<StatoRiparazioneItem> stati
) {
    public record StatoRiparazioneItem(
            @NotNull Long id,
            @NotBlank String nome,
            @NotBlank String colore,
            @NotNull Integer position
    ) {}
}
