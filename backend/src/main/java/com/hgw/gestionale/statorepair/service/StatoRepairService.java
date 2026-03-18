package com.hgw.gestionale.statorepair.service;

import com.hgw.gestionale.common.exception.ConflictException;
import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.repair.repository.RepairRepository;
import com.hgw.gestionale.statorepair.dto.CreateStatoRepairRequest;
import com.hgw.gestionale.statorepair.dto.StatoRepairResponse;
import com.hgw.gestionale.statorepair.dto.UpdateStatoRepairRequest;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statorepair.mapper.StatoRepairMapper;
import com.hgw.gestionale.statorepair.repository.StatoRepairRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatoRepairService {

    private final StatoRepairRepository statoRepairRepository;
    private final RepairRepository repairRepository;

    public StatoRepairResponse create(CreateStatoRepairRequest request) {
        StatoRepair saved = statoRepairRepository.save(StatoRepairMapper.toEntity(request));
        return StatoRepairMapper.toResponse(saved);
    }

    public List<StatoRepairResponse> getAll() {
        return statoRepairRepository.findAll().stream()
                .sorted((a, b) -> a.getPosition().compareTo(b.getPosition()))
                .map(StatoRepairMapper::toResponse)
                .toList();
    }

    public StatoRepairResponse getById(Long id) {
        StatoRepair stato = statoRepairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("StatoRepair not found"));
        return StatoRepairMapper.toResponse(stato);
    }

    @Transactional
    public List<StatoRepairResponse> updateAll(UpdateStatoRepairRequest request) {
        List<StatoRepair> existing = statoRepairRepository.findAll();

        Set<Long> existingIds = existing.stream().map(StatoRepair::getId).collect(Collectors.toSet());
        Set<Long> requestIds = request.stati().stream().map(UpdateStatoRepairRequest.StatoRepairItem::id).collect(Collectors.toSet());

        if (!existingIds.equals(requestIds)) {
            throw new ConflictException("La lista degli stati non corrisponde agli stati esistenti");
        }

        Map<Long, StatoRepair> entityMap = existing.stream().collect(Collectors.toMap(StatoRepair::getId, s -> s));

        for (UpdateStatoRepairRequest.StatoRepairItem item : request.stati()) {
            StatoRepair stato = entityMap.get(item.id());
            stato.setNome(item.nome());
            stato.setColore(item.colore());
            stato.setPosition(item.position());
        }

        return statoRepairRepository.saveAll(existing).stream()
                .sorted((a, b) -> a.getPosition().compareTo(b.getPosition()))
                .map(StatoRepairMapper::toResponse)
                .toList();
    }

    public void delete(Long id) {
        StatoRepair stato = statoRepairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("StatoRepair not found"));

        if (repairRepository.existsByStato(stato)) {
            throw new ConflictException("Impossibile eliminare lo stato: ci sono riparazioni che lo utilizzano. Cambia prima lo stato di tutte le riparazioni coinvolte");
        }

        statoRepairRepository.deleteById(stato.getId());
    }
}
