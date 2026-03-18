package com.hgw.gestionale.intervention.controller;

import com.hgw.gestionale.intervention.dto.CreateInterventionRequest;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.dto.UpdateInterventionRequest;
import com.hgw.gestionale.intervention.service.InterventionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/interventions", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class InterventionController {
    private final InterventionService interventionService;

    @PostMapping
    public InterventionResponse createIntervention(@Valid @RequestBody CreateInterventionRequest request) {
        log.info("InterventionController.create creazione intervento: {}", request.nome());
        return interventionService.create(request);
    }

    @GetMapping
    public List<InterventionResponse> getAllInterventions() {
        log.info("InterventionController.getAll richiesta lista interventi");
        return interventionService.getAll();
    }

    @GetMapping("/{id}")
    public InterventionResponse getInterventionById(@PathVariable Long id) {
        log.info("InterventionController.getById richiesta intervento id={}", id);
        return interventionService.getById(id);
    }

    @GetMapping("/by-name/{nome}")
    public InterventionResponse getInterventionByName(@PathVariable String nome) {
        log.info("InterventionController.getByName richiesta intervento nome={}", nome);
        return interventionService.getByName(nome);
    }

    @GetMapping("/search")
    public List<InterventionResponse> searchIntervention(@RequestParam String nome) {
        log.info("InterventionController.search ricerca intervento nome={}", nome);
        return interventionService.search(nome);
    }

    @PutMapping("/{id}")
    public InterventionResponse updateIntervention(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInterventionRequest request
    ) {
        log.info("InterventionController.update aggiornamento intervento id={}", id);
        return interventionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteIntervention(@PathVariable Long id) {
        log.info("InterventionController.delete eliminazione intervento id={}", id);
        interventionService.delete(id);
    }
}
