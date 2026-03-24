package com.hgw.gestionale.repair.controller;

import com.hgw.gestionale.repair.dto.CreateRepairRequest;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.dto.UpdateRepairRequest;
import com.hgw.gestionale.repair.service.RepairService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping(value = "/api/repairs", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class RepairController {
    private final RepairService repairService;

    @PostMapping
    public RepairResponse createRepair(
            @Valid @RequestBody CreateRepairRequest request,
            Authentication authentication
    ) {
        log.info("RepairController.create creazione riparazione customerId={}", request.customerId());
        return repairService.create(request, authentication.getName());
    }

    @GetMapping
    public Page<RepairResponse> getAllRepairs(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        log.info("RepairController.getAll richiesta lista riparazioni page={} size={}", pageable.getPageNumber(), pageable.getPageSize());
        return repairService.getAll(pageable);
    }

    @GetMapping("/search")
    public Page<RepairResponse> searchRepairs(
            @RequestParam(required = false) Long statoId,
            @RequestParam(required = false) Long statoRiparazioneId,
            @PageableDefault(size = 20, sort = "id") Pageable pageable
    ) {
        log.info("RepairController.search statoId={} statoRiparazioneId={}", statoId, statoRiparazioneId);
        return repairService.search(statoId, statoRiparazioneId, pageable);
    }

    @GetMapping("/{id}")
    public RepairResponse getRepairById(@PathVariable Long id) {
        log.info("RepairController.getById richiesta riparazione id={}", id);
        return repairService.getById(id);
    }

    @PutMapping("/{id}")
    public RepairResponse updateRepair(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRepairRequest request
    ) {
        log.info("RepairController.update aggiornamento riparazione id={}", id);
        return repairService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRepair(@PathVariable Long id) {
        log.info("RepairController.delete eliminazione riparazione id={}", id);
        repairService.delete(id);
    }
}
