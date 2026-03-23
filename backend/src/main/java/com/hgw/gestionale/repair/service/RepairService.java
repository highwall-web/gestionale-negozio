package com.hgw.gestionale.repair.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.repository.CustomerRepository;
import com.hgw.gestionale.product.service.ProductService;
import com.hgw.gestionale.repair.dto.CreateRepairRequest;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.dto.UpdateRepairRequest;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repair.mapper.RepairMapper;
import com.hgw.gestionale.repair.repository.RepairRepository;
import com.hgw.gestionale.repairdetails.service.RepairDetailsService;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statorepair.repository.StatoRepairRepository;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;
import com.hgw.gestionale.statoriparazione.repository.StatoRiparazioneRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepairService {
    private final RepairRepository repairRepository;
    private final CustomerRepository customerRepository;
    private final ProductService productService;
    private final StatoRepairRepository statoRepairRepository;
    private final StatoRiparazioneRepository statoRiparazioneRepository;
    private final RepairDetailsService repairDetailsService;

    @Transactional
    public RepairResponse create(CreateRepairRequest request) {

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        Repair saved = repairRepository.save(RepairMapper.toEntity(customer));

        saved.setProduct(productService.createEntity(request.product(), saved));

        if (request.details() != null) {
            saved.setDetails(repairDetailsService.createEntity(request.details(), saved));
        }

        return RepairMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<RepairResponse> search(Long statoId, Long statoRiparazioneId, Pageable pageable) {
        StatoRepair stato = statoId != null
                ? statoRepairRepository.findById(statoId).orElseThrow(() -> new NotFoundException("StatoRepair not found"))
                : null;
        StatoRiparazione statoRiparazione = statoRiparazioneId != null
                ? statoRiparazioneRepository.findById(statoRiparazioneId).orElseThrow(() -> new NotFoundException("StatoRiparazione not found"))
                : null;

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
        return page.map(r -> RepairMapper.toResponse(r));
    }

    @Transactional(readOnly = true)
    public Page<RepairResponse> getAll(Pageable pageable) {
        return repairRepository.findAll(pageable)
                .map(r -> RepairMapper.toResponse(r));
    }

    @Transactional(readOnly = true)
    public RepairResponse getById(Long id) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));
        return RepairMapper.toResponse(repair);
    }

    @Transactional
    public RepairResponse update(Long id, UpdateRepairRequest request) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        StatoRepair stato = request.statoId() != null
                ? statoRepairRepository.findById(request.statoId()).orElseThrow(() -> new NotFoundException("StatoRepair not found"))
                : null;
        StatoRiparazione statoRiparazione = request.statoRiparazioneId() != null
                ? statoRiparazioneRepository.findById(request.statoRiparazioneId()).orElseThrow(() -> new NotFoundException("StatoRiparazione not found"))
                : null;

        RepairMapper.updateEntity(repair, customer, stato, statoRiparazione);
        Repair updated = repairRepository.save(repair);

        return RepairMapper.toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));
        repairRepository.deleteById(repair.getId());
    }
}
