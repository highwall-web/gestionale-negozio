package com.hgw.gestionale.intervention.service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.intervention.dto.CreateInterventionRequest;
import com.hgw.gestionale.intervention.dto.InterventionResponse;
import com.hgw.gestionale.intervention.dto.UpdateInterventionRequest;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.intervention.mapper.InterventionMapper;
import com.hgw.gestionale.intervention.repository.InterventionRepository;
import com.hgw.gestionale.model.entity.Model;
import com.hgw.gestionale.model.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterventionService {
    private final InterventionRepository interventionRepository;
    private final ModelRepository modelRepository;

    public InterventionResponse create(CreateInterventionRequest request) {
        Long modelId = request.modelId();
        Model model = modelId != null
                ? modelRepository.findById(modelId).orElseThrow(() -> new NotFoundException("Model not found"))
                : null;
        Intervention saved = interventionRepository.save(InterventionMapper.toEntity(request, model));
        return InterventionMapper.toResponse(saved);
    }

    public List<InterventionResponse> getAll() {
        return interventionRepository.findByAttivoTrue().stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public List<InterventionResponse> getGenerali() {
        return interventionRepository.findByModelIsNullAndAttivoTrue().stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public List<InterventionResponse> getByModelId(Long modelId) {
        return interventionRepository.findByModelIdAndAttivoTrue(modelId).stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public InterventionResponse getById(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));
        return InterventionMapper.toResponse(intervention);
    }

    public InterventionResponse getByName(String nome) {
        Intervention intervention = interventionRepository.findByNomeIgnoreCaseAndAttivoTrue(nome)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));
        return InterventionMapper.toResponse(intervention);
    }

    public List<InterventionResponse> search(String nome) {
        return interventionRepository.findTop10ByNomeContainingIgnoreCaseAndAttivoTrue(nome)
                .stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public List<InterventionResponse> searchByModel(Long modelId, String nome) {
        return interventionRepository.findTop10ByModelIdAndNomeContainingIgnoreCaseAndAttivoTrue(modelId, nome)
                .stream()
                .map(InterventionMapper::toResponse)
                .toList();
    }

    public InterventionResponse update(Long id, UpdateInterventionRequest request) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));
        Long modelId = request.modelId();
        Model model = modelId != null
                ? modelRepository.findById(modelId).orElseThrow(() -> new NotFoundException("Model not found"))
                : null;

        InterventionMapper.updateEntity(intervention, request, model);
        Intervention updated = interventionRepository.save(intervention);

        return InterventionMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Intervention not found"));

        intervention.setAttivo(false);
        interventionRepository.save(intervention);
    }
}
