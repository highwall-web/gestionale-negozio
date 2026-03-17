package com.hgw.gestionale.color.service;

import com.hgw.gestionale.color.dto.ColorResponse;
import com.hgw.gestionale.color.dto.CreateColorRequest;
import com.hgw.gestionale.color.dto.UpdateColorRequest;
import com.hgw.gestionale.color.entity.Color;
import com.hgw.gestionale.color.mapper.ColorMapper;
import com.hgw.gestionale.color.repository.ColorRepository;
import com.hgw.gestionale.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ColorRepository colorRepository;

    public ColorResponse create(CreateColorRequest request) {
        Color saved = colorRepository.save(ColorMapper.toEntity(request));
        return ColorMapper.toResponse(saved);
    }

    public List<ColorResponse> getAll() {
        return colorRepository.findAll().stream()
                .map(ColorMapper::toResponse)
                .toList();
    }

    public ColorResponse getById(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Color not found"));
        return ColorMapper.toResponse(color);
    }

    public ColorResponse getByName(String nome) {
        Color color = colorRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new NotFoundException("Color not found"));
        return ColorMapper.toResponse(color);
    }

    public List<ColorResponse> search(String nome) {
        return colorRepository.findTop10ByNomeContainingIgnoreCase(nome)
                .stream()
                .map(ColorMapper::toResponse)
                .toList();
    }

    public ColorResponse update(Long id, UpdateColorRequest request) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Color not found"));

        ColorMapper.updateEntity(color, request);
        Color updated = colorRepository.save(color);

        return ColorMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Color not found"));

        colorRepository.deleteById(color.getId());
    }
}
