package com.hgw.gestionale.repairdetails.controller;

import com.hgw.gestionale.repairdetails.dto.AddMessageRequest;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.RepairMessageResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.service.RepairDetailsService;
import com.hgw.gestionale.repairdetails.service.RepairMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/repairs/{repairId}/details", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class RepairDetailsController {
    private final RepairDetailsService repairDetailsService;
    private final RepairMessageService repairMessageService;

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

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public RepairMessageResponse addMessage(
            @PathVariable Long repairId,
            @Valid @RequestBody AddMessageRequest request,
            Authentication authentication
    ) {
        log.info("RepairDetailsController.addMessage repairId={}", repairId);
        return repairMessageService.addMessage(repairId, request, authentication.getName());
    }

    @DeleteMapping("/messages/{messageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMessage(@PathVariable Long repairId, @PathVariable Long messageId) {
        log.info("RepairDetailsController.deleteMessage repairId={} messageId={}", repairId, messageId);
        repairMessageService.deleteMessage(messageId);
    }
}
