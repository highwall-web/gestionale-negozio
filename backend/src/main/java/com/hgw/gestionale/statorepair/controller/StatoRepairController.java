package com.hgw.gestionale.statorepair.controller;

import com.hgw.gestionale.statorepair.dto.CreateStatoRepairRequest;
import com.hgw.gestionale.statorepair.dto.StatoRepairResponse;
import com.hgw.gestionale.statorepair.dto.UpdateStatoRepairRequest;
import com.hgw.gestionale.statorepair.service.StatoRepairService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stato-repair")
@RequiredArgsConstructor
@Slf4j
public class StatoRepairController {
    private final StatoRepairService statoRepairService;

    @PostMapping
    public StatoRepairResponse createStatoRepair(@Valid @RequestBody CreateStatoRepairRequest request) {
        log.info("StatoRepairController.create creazione stato repair nome={}", request.nome());
        return statoRepairService.create(request);
    }

    @GetMapping
    public List<StatoRepairResponse> getAllStatoRepair() {
        log.info("StatoRepairController.getAll richiesta lista stato repair");
        return statoRepairService.getAll();
    }

    @GetMapping("/{id}")
    public StatoRepairResponse getStatoRepairById(@PathVariable Long id) {
        log.info("StatoRepairController.getById richiesta stato repair id={}", id);
        return statoRepairService.getById(id);
    }

    @PutMapping
    public List<StatoRepairResponse> updateAllStatoRepair(@Valid @RequestBody UpdateStatoRepairRequest request) {
        log.info("StatoRepairController.updateAll aggiornamento lista stato repair");
        return statoRepairService.updateAll(request);
    }

    @DeleteMapping("/{id}")
    public void deleteStatoRepair(@PathVariable Long id) {
        log.info("StatoRepairController.delete eliminazione stato repair id={}", id);
        statoRepairService.delete(id);
    }
}
