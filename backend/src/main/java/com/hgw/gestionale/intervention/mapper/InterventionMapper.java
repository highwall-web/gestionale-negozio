package com.hgw.gestionale.intervention.mapper;

import com.hgw.gestionale.intervention.dto.CreateInterventionRequest;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.dto.UpdateInterventionRequest;
import com.hgw.gestionale.intervention.entity.Intervention;

public final class InterventionMapper {
    private InterventionMapper() {}

    public static Intervention toEntity(CreateInterventionRequest request) {
        return Intervention.builder()
                .nome(request.nome())
                .prezzo(request.prezzo())
                .periodoGaranzia(request.periodoGaranzia())
                .build();
    }

    public static InterventionResponse toResponse(Intervention intervention) {
        return new InterventionResponse(
                intervention.getId(),
                intervention.getNome(),
                intervention.getPrezzo(),
                intervention.getPeriodoGaranzia()
        );
    }

    public static void updateEntity(Intervention intervention, UpdateInterventionRequest request) {
        intervention.setNome(request.nome());
        intervention.setPrezzo(request.prezzo());
        intervention.setPeriodoGaranzia(request.periodoGaranzia());
    }
}
