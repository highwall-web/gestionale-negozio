package com.hgw.gestionale.model.controller;

import com.hgw.gestionale.model.dto.CreateModelRequest;
import com.hgw.gestionale.model.dto.ModelResponse;
import com.hgw.gestionale.model.dto.UpdateModelRequest;
import com.hgw.gestionale.model.service.ModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/models", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class ModelController {
    private final ModelService modelService;

    @PostMapping
    public ModelResponse createModel(@Valid @RequestBody CreateModelRequest request) {
        log.info("ModelController.create creazione model: {}", request.nome());
        return modelService.create(request);
    }

    @GetMapping
    public List<ModelResponse> getAllModels() {
        log.info("ModelController.getAll richiesta lista model");
        return modelService.getAll();
    }

    @GetMapping("/{id}")
    public ModelResponse getModelById(@PathVariable Long id) {
        log.info("ModelController.getModelById richiesta model id={}", id);
        return modelService.getById(id);
    }

    @GetMapping("/by-brand-id/{id}")
    public List<ModelResponse> getModelsByBrandId(@PathVariable Long id) {
        log.info("ModelController.getModelByBrandId richiesta model id={}", id);
        return modelService.getByBrandId(id);
    }

    @GetMapping("/by-name/{nome}")
    public ModelResponse getModelByName(@PathVariable String nome) {
        log.info("ModelController.getByName richiesta model nome={}", nome);
        return modelService.getByName(nome);
    }

    @GetMapping("/search")
    public List<ModelResponse> searchModel(@RequestParam String nome) {
        log.info("ModelController.searchModel ricerca model nome={}", nome);
        return modelService.search(nome);
    }

    @GetMapping("/search/by-brand")
    public List<ModelResponse> searchModelByBrand(
            @RequestParam Long brandId,
            @RequestParam String nome
    ) {
        log.info("ModelController.searchModelByBrand ricerca model by brand nome={} brand={}", nome, brandId);
        return modelService.searchByBrand(brandId, nome);
    }

    @PutMapping("/{id}")
    public ModelResponse updateModel(
            @PathVariable Long id,
            @Valid @RequestBody UpdateModelRequest request
    ) {
        log.info("ModelController.update aggiornamento model id={}", id);
        return modelService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteModel(@PathVariable Long id) {
        log.info("ModelController.delete eliminazione model id={}", id);
        modelService.delete(id);
    }
}
