package com.hgw.gestionale.repairdetails.mapper;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;

public final class RepairDetailsMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private RepairDetailsMapper() {}

    public static RepairDetails toEntity(CreateRepairDetailsRequest request, Repair repair) {
        return RepairDetails.builder()
                .repair(repair)
                .isPreventivo(request.isPreventivo())
                .interventionIds(serializeIds(request.interventionIds()))
                .commenti(request.commenti())
                .dataConsegna(request.dataConsegna())
                .acconto(request.acconto())
                .build();
    }

    public static RepairDetailsResponse toResponse(RepairDetails details) {
        return new RepairDetailsResponse(
                details.getId(),
                details.getRepair().getId(),
                details.isPreventivo(),
                deserializeIds(details.getInterventionIds()),
                details.getCommenti(),
                details.getDataConsegna(),
                details.getAcconto()
        );
    }

    public static void updateEntity(RepairDetails details, UpdateRepairDetailsRequest request) {
        details.setPreventivo(request.isPreventivo());
        details.setInterventionIds(serializeIds(request.interventionIds()));
        details.setCommenti(request.commenti());
        details.setDataConsegna(request.dataConsegna());
        details.setAcconto(request.acconto());
    }

    public static List<Long> deserializeIds(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize intervention ids", e);
        }
    }

    public static String serializeIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(ids);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize intervention ids", e);
        }
    }
}
