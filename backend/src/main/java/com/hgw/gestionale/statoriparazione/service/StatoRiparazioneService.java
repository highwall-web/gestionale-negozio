package com.hgw.gestionale.statoriparazione.service;

import com.hgw.gestionale.common.exception.ConflictException;
import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.repair.repository.RepairRepository;
import com.hgw.gestionale.statoriparazione.dto.CreateStatoRiparazioneRequest;
import com.hgw.gestionale.statoriparazione.dto.StatoRiparazioneResponse;
import com.hgw.gestionale.statoriparazione.dto.UpdateStatoRiparazioneRequest;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;
import com.hgw.gestionale.statoriparazione.mapper.StatoRiparazioneMapper;
import com.hgw.gestionale.statoriparazione.repository.StatoRiparazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatoRiparazioneService {

    private final StatoRiparazioneRepository statoRiparazioneRepository;
    private final RepairRepository repairRepository;

    public StatoRiparazioneResponse create(CreateStatoRiparazioneRequest request) {
        StatoRiparazione saved = statoRiparazioneRepository.save(StatoRiparazioneMapper.toEntity(request));
        return StatoRiparazioneMapper.toResponse(saved);
    }

    public List<StatoRiparazioneResponse> getAll() {
        return statoRiparazioneRepository.findAll().stream()
                .sorted((a, b) -> a.getPosition().compareTo(b.getPosition()))
                .map(StatoRiparazioneMapper::toResponse)
                .toList();
    }

    public StatoRiparazioneResponse getById(Long id) {
        StatoRiparazione stato = statoRiparazioneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("StatoRiparazione not found"));
        return StatoRiparazioneMapper.toResponse(stato);
    }

    @Transactional
    public List<StatoRiparazioneResponse> updateAll(UpdateStatoRiparazioneRequest request) {
        List<StatoRiparazione> existing = statoRiparazioneRepository.findAll();

        Set<Long> existingIds = existing.stream().map(StatoRiparazione::getId).collect(Collectors.toSet());
        Set<Long> requestIds = request.stati().stream().map(UpdateStatoRiparazioneRequest.StatoRiparazioneItem::id).collect(Collectors.toSet());

        if (!existingIds.equals(requestIds)) {
            throw new ConflictException("La lista degli stati non corrisponde agli stati esistenti");
        }

        Map<Long, StatoRiparazione> entityMap = existing.stream().collect(Collectors.toMap(StatoRiparazione::getId, s -> s));

        for (UpdateStatoRiparazioneRequest.StatoRiparazioneItem item : request.stati()) {
            StatoRiparazione stato = entityMap.get(item.id());
            stato.setNome(item.nome());
            stato.setColore(item.colore());
            stato.setPosition(item.position());
        }

        return statoRiparazioneRepository.saveAll(existing).stream()
                .sorted((a, b) -> a.getPosition().compareTo(b.getPosition()))
                .map(StatoRiparazioneMapper::toResponse)
                .toList();
    }

    public void delete(Long id) {
        StatoRiparazione stato = statoRiparazioneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("StatoRiparazione not found"));

        if (repairRepository.existsByStatoRiparazione(stato)) {
            throw new ConflictException("Impossibile eliminare lo stato: ci sono riparazioni che lo utilizzano. Cambia prima lo stato di tutte le riparazioni coinvolte");
        }

        statoRiparazioneRepository.deleteById(stato.getId());
    }
}
