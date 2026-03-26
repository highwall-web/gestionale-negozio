package com.hgw.gestionale.product.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hgw.gestionale.color.entity.Color;
import com.hgw.gestionale.color.mapper.ColorMapper;
import com.hgw.gestionale.model.entity.Model;
import com.hgw.gestionale.model.mapper.ModelMapper;
import com.hgw.gestionale.product.dto.CreateProductRequest;
import com.hgw.gestionale.product.dto.ProductResponse;
import com.hgw.gestionale.product.dto.UpdateProductRequest;
import com.hgw.gestionale.product.entity.Product;
import com.hgw.gestionale.repair.entity.Repair;

import java.util.List;
import java.util.Map;

public final class ProductMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private ProductMapper() {}

    public static Product toEntity(CreateProductRequest request, Model model, Color color, Repair repair) {
        return Product.builder()
                .repair(repair)
                .model(model)
                .color(color)
                .capacita(request.capacita())
                .codiceUnlock(request.codiceUnlock())
                .sequenzaUnlock(serializeList(request.sequenzaUnlock()))
                .pin(request.pin())
                .accessori(request.accessori())
                .contattoConLiquidi(request.contattoConLiquidi())
                .dispositivoNonTestabile(request.dispositivoNonTestabile())
                .acquistatoPressoDiNoi(request.acquistatoPressoDiNoi())
                .seriale(request.seriale())
                .imei(request.imei())
                .codiceModello(request.codiceModello())
                .testDiagnostici(serializeMap(request.testDiagnostici()))
                .build();
    }

    public static ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                ModelMapper.toResponse(product.getModel()),
                ColorMapper.toResponse(product.getColor()),
                product.getCapacita(),
                product.getCodiceUnlock(),
                deserializeList(product.getSequenzaUnlock()),
                product.getPin(),
                product.getAccessori(),
                product.getContattoConLiquidi(),
                product.getDispositivoNonTestabile(),
                product.getAcquistatoPressoDiNoi(),
                product.getSeriale(),
                product.getImei(),
                product.getCodiceModello(),
                deserializeMap(product.getTestDiagnostici())
        );
    }

    public static void updateEntity(Product product, UpdateProductRequest request, Model model, Color color) {
        product.setModel(model);
        product.setColor(color);
        product.setCapacita(request.capacita());
        product.setCodiceUnlock(request.codiceUnlock());
        product.setSequenzaUnlock(serializeList(request.sequenzaUnlock()));
        product.setPin(request.pin());
        product.setAccessori(request.accessori());
        product.setContattoConLiquidi(request.contattoConLiquidi());
        product.setDispositivoNonTestabile(request.dispositivoNonTestabile());
        product.setAcquistatoPressoDiNoi(request.acquistatoPressoDiNoi());
        product.setSeriale(request.seriale());
        product.setImei(request.imei());
        product.setCodiceModello(request.codiceModello());
        product.setTestDiagnostici(serializeMap(request.testDiagnostici()));
    }

    private static String serializeList(List<Integer> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize list", e);
        }
    }

    private static List<Integer> deserializeList(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Integer>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize list", e);
        }
    }

    private static String serializeMap(Map<String, List<String>> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize map", e);
        }
    }

    private static Map<String, List<String>> deserializeMap(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, List<String>>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize map", e);
        }
    }
}
