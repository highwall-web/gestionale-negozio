package com.hgw.gestionale.model.service;

import com.hgw.gestionale.brand.entity.Brand;
import com.hgw.gestionale.brand.repository.BrandRepository;
import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.model.dto.CreateModelRequest;
import com.hgw.gestionale.model.dto.ModelResponse;
import com.hgw.gestionale.model.dto.UpdateModelRequest;
import com.hgw.gestionale.model.entity.Model;
import com.hgw.gestionale.model.mapper.ModelMapper;
import com.hgw.gestionale.model.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {

    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;

    public ModelResponse create(CreateModelRequest request) {
        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new NotFoundException("Brand not found"));

        Model saved = modelRepository.save(ModelMapper.toEntity(request, brand));
        return ModelMapper.toResponse(saved);
    }

    public List<ModelResponse> getAll() {
        return modelRepository.findAll().stream()
                .map(ModelMapper::toResponse)
                .toList();
    }

    public List<ModelResponse> getByBrandId(Long brandId) {
        return modelRepository.findByBrandId(brandId).stream()
                .map(ModelMapper::toResponse)
                .toList();
    }

    public ModelResponse getById(Long id) {
        Model model = modelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Model not found"));
        return ModelMapper.toResponse(model);
    }

    public ModelResponse getByName(String nome) {
        Model model = modelRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new NotFoundException("Model not found"));
        return ModelMapper.toResponse(model);
    }

    public List<ModelResponse> search(String nome) {
        return modelRepository.findTop10ByNomeContainingIgnoreCase(nome)
                .stream()
                .map(ModelMapper::toResponse)
                .toList();
    }

    public List<ModelResponse> searchByBrand(Long brandId, String nome) {
        return modelRepository.findTop10ByBrandIdAndNomeContainingIgnoreCase(brandId, nome)
                .stream()
                .map(ModelMapper::toResponse)
                .toList();
    }

    public List<ModelResponse> searchByBrandName(String brandNome, String nome) {
        return modelRepository.findTop10ByBrandNomeContainingIgnoreCaseAndNomeContainingIgnoreCase(brandNome, nome)
                .stream()
                .map(ModelMapper::toResponse)
                .toList();
    }


    public ModelResponse update(Long id, UpdateModelRequest request) {
        Model model = modelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Model not found"));

        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new NotFoundException("Brand not found"));

        ModelMapper.updateEntity(model, request, brand);
        Model updated = modelRepository.save(model);

        return ModelMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Model model = modelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Model not found"));

        modelRepository.deleteById(model.getId());
    }
}
