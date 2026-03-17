package com.hgw.gestionale.intervention.service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.intervention.dto.CreateInterventionRequest;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.dto.UpdateInterventionRequest;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.intervention.mapper.InterventionMapper;
import com.hgw.gestionale.intervention.repository.InterventionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterventionService {
    private final InterventionRepository interventionRepository;

    public InterventionResponse create(CreateInterventionRequest request) {
        Intervention saved = interventionRepository.save(InterventionMapper.toEntity(request));
        return InterventionMapper.toResponse(saved);
    }

    public List<InterventionResponse> getAll() {
        return interventionRepository.findAll().stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public InterventionResponse getById(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));
        return InterventionMapper.toResponse(intervention);
    }

    public InterventionResponse getByName(String nome) {
        Intervention intervention = interventionRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));
        return InterventionMapper.toResponse(intervention);
    }

    public List<InterventionResponse> search(String nome) {
        return interventionRepository.findTop10ByNomeContainingIgnoreCase(nome)
                .stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public InterventionResponse update(Long id, UpdateInterventionRequest request) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));

        InterventionMapper.updateEntity(intervention, request);
        Intervention updated = interventionRepository.save(intervention);

        return InterventionMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));

        interventionRepository.deleteById(intervention.getId());
    }
}
