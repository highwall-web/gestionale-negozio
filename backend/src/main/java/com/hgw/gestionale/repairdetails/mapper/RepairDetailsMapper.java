package com.hgw.gestionale.repairdetails.mapper;

import java.util.List;

import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.InterventionQuantitaResponse;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.RepairMessageResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;

public final class RepairDetailsMapper {

    private RepairDetailsMapper() {}

    public static RepairDetails toEntity(CreateRepairDetailsRequest request, Repair repair) {
        return RepairDetails.builder()
                .repair(repair)
                .isPreventivo(request.isPreventivo())
                .dataConsegna(request.dataConsegna())
                .acconto(request.acconto())
                .build();
    }

    public static RepairDetailsResponse toResponse(RepairDetails details) {
        List<RepairMessageResponse> messaggi = details.getMessaggi().stream()
                .map(RepairMessageMapper::toResponse)
                .toList();

        List<InterventionQuantitaResponse> interventi = details.getInterventions().stream()
                .map(rdi -> new InterventionQuantitaResponse(
                        rdi.getIntervention().getId(),
                        rdi.getIntervention().getNome(),
                        rdi.getIntervention().getPrezzo(),
                        rdi.getQuantita()
                ))
                .toList();

        return new RepairDetailsResponse(
                details.getId(),
                details.getRepair().getId(),
                details.isPreventivo(),
                interventi,
                details.getDataConsegna(),
                details.getAcconto(),
                messaggi
        );
    }

    public static void updateEntity(RepairDetails details, UpdateRepairDetailsRequest request) {
        details.setPreventivo(request.isPreventivo());
        details.setDataConsegna(request.dataConsegna());
        details.setAcconto(request.acconto());
    }
}
