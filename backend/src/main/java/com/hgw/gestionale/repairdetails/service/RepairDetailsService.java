package com.hgw.gestionale.repairdetails.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.intervention.repository.InterventionRepository;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repair.repository.RepairRepository;
import com.hgw.gestionale.repairdetails.dto.AddMessageRequest;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.InterventionQuantitaRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import com.hgw.gestionale.repairdetails.entity.RepairDetailsIntervention;
import com.hgw.gestionale.repairdetails.entity.RepairMessage;
import com.hgw.gestionale.repairdetails.mapper.RepairDetailsMapper;
import com.hgw.gestionale.repairdetails.repository.RepairDetailsInterventionRepository;
import com.hgw.gestionale.repairdetails.repository.RepairDetailsRepository;
import com.hgw.gestionale.repairdetails.repository.RepairMessageRepository;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepairDetailsService {
    private final RepairDetailsRepository repairDetailsRepository;
    private final RepairMessageRepository repairMessageRepository;
    private final RepairDetailsInterventionRepository repairDetailsInterventionRepository;
    private final InterventionRepository interventionRepository;
    private final RepairRepository repairRepository;

    public RepairDetails createEntity(CreateRepairDetailsRequest request, Repair repair, String autore) {
        RepairDetails details = repairDetailsRepository.save(RepairDetailsMapper.toEntity(request, repair));

        saveInterventi(details, request.interventi());

        List<AddMessageRequest> messaggi = request.messaggi();
        if (messaggi != null && !messaggi.isEmpty()) {
            LocalDateTime now = LocalDateTime.now();
            messaggi.forEach(m -> repairMessageRepository.save(RepairMessage.builder()
                    .repairDetails(details)
                    .testo(m.testo())
                    .autore(autore)
                    .createdAt(now)
                    .build()));
        }

        return details;
    }

    public RepairDetailsResponse getByRepairId(Long repairId) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));
        return RepairDetailsMapper.toResponse(details);
    }

    @Transactional
    public RepairDetailsResponse update(Long repairId, UpdateRepairDetailsRequest request) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));

        RepairDetailsMapper.updateEntity(details, request);
        repairDetailsInterventionRepository.deleteByRepairDetailsId(details.getId());
        details.getInterventions().clear();
        repairDetailsRepository.save(details);

        saveInterventi(details, request.interventi());

        BigDecimal costoTotale = details.getInterventions().stream()
                .map(rdi -> rdi.getIntervention().getPrezzo().multiply(BigDecimal.valueOf(rdi.getQuantita())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Repair repair = details.getRepair();
        repair.setCostoTotale(costoTotale);
        repairRepository.save(repair);

        return RepairDetailsMapper.toResponse(details);
    }

    public void delete(Long repairId) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));
        repairDetailsRepository.deleteById(details.getId());
    }

    private void saveInterventi(RepairDetails details, List<InterventionQuantitaRequest> interventi) {
        if (interventi == null || interventi.isEmpty()) return;

        Map<Long, Intervention> interventionMap = interventionRepository
                .findAllById(interventi.stream().map(InterventionQuantitaRequest::interventionId).toList())
                .stream()
                .collect(Collectors.toMap(Intervention::getId, i -> i));

        interventi.forEach(req -> {
            Intervention intervention = interventionMap.get(req.interventionId());
            if (intervention == null) throw new NotFoundException("Intervention not found: " + req.interventionId());
            RepairDetailsIntervention rdi = RepairDetailsIntervention.builder()
                    .repairDetails(details)
                    .intervention(intervention)
                    .quantita(req.quantita())
                    .build();
            RepairDetailsIntervention saved = repairDetailsInterventionRepository.save(rdi);
            details.getInterventions().add(saved);
        });
    }
}
