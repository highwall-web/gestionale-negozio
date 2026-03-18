package com.hgw.gestionale.statorepair.mapper;

import com.hgw.gestionale.statorepair.dto.CreateStatoRepairRequest;
import com.hgw.gestionale.statorepair.dto.StatoRepairResponse;
import com.hgw.gestionale.statorepair.entity.StatoRepair;

public final class StatoRepairMapper {
    private StatoRepairMapper() {}

    public static StatoRepair toEntity(CreateStatoRepairRequest request) {
        return StatoRepair.builder()
                .nome(request.nome())
                .colore(request.colore())
                .position(request.position())
                .build();
    }

    public static StatoRepairResponse toResponse(StatoRepair stato) {
        return new StatoRepairResponse(
                stato.getId(),
                stato.getNome(),
                stato.getColore(),
                stato.getPosition()
        );
    }
}
