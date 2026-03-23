package com.hgw.gestionale.repairdetails.service;

import org.springframework.stereotype.Service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.intervention.repository.InterventionRepository;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.dto.RepairDetailsResponse;
import com.hgw.gestionale.repairdetails.dto.UpdateRepairDetailsRequest;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import com.hgw.gestionale.repairdetails.mapper.RepairDetailsMapper;
import com.hgw.gestionale.repairdetails.repository.RepairDetailsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepairDetailsService {
    private final RepairDetailsRepository repairDetailsRepository;

    public RepairDetails createEntity(CreateRepairDetailsRequest request, Repair repair){
        return repairDetailsRepository.save(RepairDetailsMapper.toEntity(request, repair));
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
