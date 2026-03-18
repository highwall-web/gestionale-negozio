package com.hgw.gestionale.statoriparazione.dto;

public record StatoRiparazioneResponse(
        Long id,
        String nome,
        String colore,
        Integer position
) {
}
