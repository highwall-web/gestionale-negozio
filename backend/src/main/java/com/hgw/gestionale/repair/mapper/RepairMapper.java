package com.hgw.gestionale.repair.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.mapper.CustomerMapper;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.intervention.mapper.InterventionMapper;
import com.hgw.gestionale.product.entity.Product;
import com.hgw.gestionale.product.mapper.ProductMapper;
import com.hgw.gestionale.repair.dto.CreateRepairRequest;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.dto.UpdateRepairRequest;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statorepair.mapper.StatoRepairMapper;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;
import com.hgw.gestionale.statoriparazione.mapper.StatoRiparazioneMapper;

import java.util.List;

public final class RepairMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private RepairMapper() {}

    public static Repair toEntity(CreateRepairRequest request, Customer customer, Product product) {
        return Repair.builder()
                .customer(customer)
                .product(product)
                .interventionIds(serializeIds(request.interventionIds()))
                .commenti(request.commenti())
                .dataConsegna(request.dataConsegna())
                .tariffa(request.tariffa())
                .acconto(request.acconto())
                .build();
    }

    public static RepairResponse toResponse(Repair repair, List<Intervention> interventions) {
        List<InterventionResponse> interventionResponses = interventions == null ? null :
                interventions.stream().map(InterventionMapper::toResponse).toList();

        return new RepairResponse(
                repair.getId(),
                CustomerMapper.toResponse(repair.getCustomer()),
                ProductMapper.toResponse(repair.getProduct()),
                interventionResponses,
                repair.getCommenti(),
                repair.getDataConsegna(),
                repair.getTariffa(),
                repair.getAcconto(),
                repair.getStato() != null ? StatoRepairMapper.toResponse(repair.getStato()) : null,
                repair.getStatoRiparazione() != null ? StatoRiparazioneMapper.toResponse(repair.getStatoRiparazione()) : null
        );
    }

    public static void updateEntity(Repair repair, UpdateRepairRequest request, Customer customer, Product product,
                                    StatoRepair stato, StatoRiparazione statoRiparazione) {
        repair.setCustomer(customer);
        repair.setProduct(product);
        repair.setInterventionIds(serializeIds(request.interventionIds()));
        repair.setCommenti(request.commenti());
        repair.setDataConsegna(request.dataConsegna());
        repair.setTariffa(request.tariffa());
        repair.setAcconto(request.acconto());
        repair.setStato(stato);
        repair.setStatoRiparazione(statoRiparazione);
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

    private static String serializeIds(List<Long> ids) {
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
