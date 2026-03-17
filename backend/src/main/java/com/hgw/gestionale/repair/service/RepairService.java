package com.hgw.gestionale.repair.service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.repository.CustomerRepository;
import com.hgw.gestionale.intervention.entity.Intervention;
import com.hgw.gestionale.intervention.repository.InterventionRepository;
import com.hgw.gestionale.product.entity.Product;
import com.hgw.gestionale.product.repository.ProductRepository;
import com.hgw.gestionale.repair.dto.CreateRepairRequest;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.dto.UpdateRepairRequest;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repair.entity.Stato;
import com.hgw.gestionale.repair.entity.StatoRiparazione;
import com.hgw.gestionale.repair.mapper.RepairMapper;
import com.hgw.gestionale.repair.repository.RepairRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairService {
    private final RepairRepository repairRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InterventionRepository interventionRepository;

    public RepairResponse create(CreateRepairRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        Repair saved = repairRepository.save(RepairMapper.toEntity(request, customer, product));
        return RepairMapper.toResponse(saved, resolveInterventions(saved.getInterventionIds()));
    }

    public Page<RepairResponse> search(Stato stato, StatoRiparazione statoRiparazione, Pageable pageable) {
        Page<Repair> page;
        if (stato != null && statoRiparazione != null) {
            page = repairRepository.findByStatoAndStatoRiparazione(stato, statoRiparazione, pageable);
        } else if (stato != null) {
            page = repairRepository.findByStato(stato, pageable);
        } else if (statoRiparazione != null) {
            page = repairRepository.findByStatoRiparazione(statoRiparazione, pageable);
        } else {
            page = repairRepository.findAll(pageable);
        }
        return page.map(r -> RepairMapper.toResponse(r, resolveInterventions(r.getInterventionIds())));
    }

    public Page<RepairResponse> getAll(Pageable pageable) {
        return repairRepository.findAll(pageable)
                .map(r -> RepairMapper.toResponse(r, resolveInterventions(r.getInterventionIds())));
    }

    public RepairResponse getById(Long id) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));
        return RepairMapper.toResponse(repair, resolveInterventions(repair.getInterventionIds()));
    }

    public RepairResponse update(Long id, UpdateRepairRequest request) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        RepairMapper.updateEntity(repair, request, customer, product);
        Repair updated = repairRepository.save(repair);

        return RepairMapper.toResponse(updated, resolveInterventions(updated.getInterventionIds()));
    }

    public void delete(Long id) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));
        repairRepository.deleteById(repair.getId());
    }

    private List<Intervention> resolveInterventions(String interventionIds) {
        List<Long> ids = RepairMapper.deserializeIds(interventionIds);
        if (ids.isEmpty()) {
            return List.of();
        }
        return interventionRepository.findAllById(ids);
    }
}
