package com.hgw.gestionale.repairdetails.controller;

import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.service.RepairDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/repairs/{repairId}/details", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class RepairDetailsController {
    private final RepairDetailsService repairDetailsService;

    @GetMapping
    public RepairDetailsResponse getDetails(@PathVariable Long repairId) {
        log.info("RepairDetailsController.get repairId={}", repairId);
        return repairDetailsService.getByRepairId(repairId);
    }

    @PutMapping
    public RepairDetailsResponse updateDetails(
            @PathVariable Long repairId,
            @Valid @RequestBody UpdateRepairDetailsRequest request
    ) {
        log.info("RepairDetailsController.update repairId={}", repairId);
        return repairDetailsService.update(repairId, request);
    }

    @DeleteMapping
    public void deleteDetails(@PathVariable Long repairId) {
        log.info("RepairDetailsController.delete repairId={}", repairId);
        repairDetailsService.delete(repairId);
    }
}
