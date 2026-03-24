package com.hgw.gestionale.repairdetails.service;

import org.springframework.stereotype.Service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repairdetails.dto.AddMessageRequest;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import com.hgw.gestionale.repairdetails.entity.RepairMessage;
import com.hgw.gestionale.repairdetails.mapper.RepairDetailsMapper;
import com.hgw.gestionale.repairdetails.repository.RepairDetailsRepository;
import com.hgw.gestionale.repairdetails.repository.RepairMessageRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairDetailsService {
    private final RepairDetailsRepository repairDetailsRepository;
    private final RepairMessageRepository repairMessageRepository;

    public RepairDetails createEntity(CreateRepairDetailsRequest request, Repair repair, String autore) {
        RepairDetails details = repairDetailsRepository.save(RepairDetailsMapper.toEntity(request, repair));

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

    public RepairDetailsResponse update(Long repairId, UpdateRepairDetailsRequest request) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));

        RepairDetailsMapper.updateEntity(details, request);
        RepairDetails updated = repairDetailsRepository.save(details);
        return RepairDetailsMapper.toResponse(updated);
    }

    public void delete(Long repairId) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));
        repairDetailsRepository.deleteById(details.getId());
    }
}
