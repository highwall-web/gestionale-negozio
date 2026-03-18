package com.hgw.gestionale.statoriparazione.mapper;

import com.hgw.gestionale.statoriparazione.dto.CreateStatoRiparazioneRequest;
import com.hgw.gestionale.statoriparazione.dto.StatoRiparazioneResponse;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;

public final class StatoRiparazioneMapper {
    private StatoRiparazioneMapper() {}

    public static StatoRiparazione toEntity(CreateStatoRiparazioneRequest request) {
        return StatoRiparazione.builder()
                .nome(request.nome())
                .colore(request.colore())
                .position(request.position())
                .build();
    }

    public static StatoRiparazioneResponse toResponse(StatoRiparazione stato) {
        return new StatoRiparazioneResponse(
                stato.getId(),
                stato.getNome(),
                stato.getColore(),
                stato.getPosition()
        );
    }
}
