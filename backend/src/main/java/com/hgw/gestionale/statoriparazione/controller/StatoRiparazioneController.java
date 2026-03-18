package com.hgw.gestionale.statoriparazione.controller;

import com.hgw.gestionale.statoriparazione.dto.CreateStatoRiparazioneRequest;
import com.hgw.gestionale.statoriparazione.dto.StatoRiparazioneResponse;
import com.hgw.gestionale.statoriparazione.dto.UpdateStatoRiparazioneRequest;
import com.hgw.gestionale.statoriparazione.service.StatoRiparazioneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stato-riparazione")
@RequiredArgsConstructor
@Slf4j
public class StatoRiparazioneController {
    private final StatoRiparazioneService statoRiparazioneService;

    @PostMapping
    public StatoRiparazioneResponse createStatoRiparazione(@Valid @RequestBody CreateStatoRiparazioneRequest request) {
        log.info("StatoRiparazioneController.create creazione stato riparazione nome={}", request.nome());
        return statoRiparazioneService.create(request);
    }

    @GetMapping
    public List<StatoRiparazioneResponse> getAllStatoRiparazione() {
        log.info("StatoRiparazioneController.getAll richiesta lista stato riparazione");
        return statoRiparazioneService.getAll();
    }

    @GetMapping("/{id}")
    public StatoRiparazioneResponse getStatoRiparazioneById(@PathVariable Long id) {
        log.info("StatoRiparazioneController.getById richiesta stato riparazione id={}", id);
        return statoRiparazioneService.getById(id);
    }

    @PutMapping
    public List<StatoRiparazioneResponse> updateAllStatoRiparazione(@Valid @RequestBody UpdateStatoRiparazioneRequest request) {
        log.info("StatoRiparazioneController.updateAll aggiornamento lista stato riparazione");
        return statoRiparazioneService.updateAll(request);
    }

    @DeleteMapping("/{id}")
    public void deleteStatoRiparazione(@PathVariable Long id) {
        log.info("StatoRiparazioneController.delete eliminazione stato riparazione id={}", id);
        statoRiparazioneService.delete(id);
    }
}
