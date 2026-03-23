package com.hgw.gestionale.intervention.mapper;

import com.hgw.gestionale.intervention.dto.CreateInterventionRequest;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.dto.UpdateInterventionRequest;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.model.entity.Model;

public final class InterventionMapper {
    private InterventionMapper() {}

    public static Intervention toEntity(CreateInterventionRequest request, Model model) {
        return Intervention.builder()
                .model(model)
                .nome(request.nome())
                .prezzo(request.prezzo())
                .periodoGaranzia(request.periodoGaranzia())
                .cumulabile(request.cumulabile())
                .build();
    }

    public static InterventionResponse toResponse(Intervention intervention) {
        Model model = intervention.getModel();
        return new InterventionResponse(
                intervention.getId(),
                model != null ? model.getId() : null,
                model != null ? model.getNome() : null,
                intervention.getNome(),
                intervention.getPrezzo(),
                intervention.getPeriodoGaranzia(),
                intervention.getCumulabile()
        );
    }

    public static void updateEntity(Intervention intervention, UpdateInterventionRequest request, Model model) {
        intervention.setModel(model);
        intervention.setNome(request.nome());
        intervention.setPrezzo(request.prezzo());
        intervention.setPeriodoGaranzia(request.periodoGaranzia());
        intervention.setCumulabile(request.cumulabile());
    }
}
