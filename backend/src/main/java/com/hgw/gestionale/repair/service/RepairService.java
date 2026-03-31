package com.hgw.gestionale.repair.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.mapper.CustomerMapper;
import com.hgw.gestionale.customer.repository.CustomerRepository;
import com.hgw.gestionale.product.service.ProductService;
import com.hgw.gestionale.repair.dto.CreateRepairRequest;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.dto.UpdateRepairRequest;
import com.hgw.gestionale.repair.dto.UpdateStatoRepairRequest;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repair.mapper.RepairMapper;
import com.hgw.gestionale.repair.repository.RepairRepository;
import com.hgw.gestionale.repairdetails.service.RepairDetailsService;
import com.hgw.gestionale.statorepair.StatoRepair;
import com.hgw.gestionale.statoriparazione.StatoRiparazione;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairService {
    private final RepairRepository repairRepository;
    private final CustomerRepository customerRepository;
    private final ProductService productService;
    private final RepairDetailsService repairDetailsService;

    @Transactional
    public RepairResponse create(CreateRepairRequest request, String autore) {

        Customer customer = null;

        if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
            CustomerMapper.updateEntity(customer, request.customer());
            customer = customerRepository.save(customer);
        }else{
            customer = customerRepository.save(CustomerMapper.toEntity(request.customer()));
        }

        Repair saved = repairRepository.save(RepairMapper.toEntity(customer));

        saved.setStato(StatoRepair.NUOVO);
        saved.setStatoRiparazione(request.details().isPreventivo()
                ? StatoRiparazione.IN_ATTESA_DI_PREVENTIVO
                : StatoRiparazione.ACCETTATO);

        saved.setProduct(productService.createEntity(request.product(), saved));
        saved.setDetails(repairDetailsService.createEntity(request.details(), saved, autore));

        BigDecimal costoTotale = saved.getDetails().getInterventions().stream()
                .map(rdi -> rdi.getIntervention().getPrezzo().multiply(BigDecimal.valueOf(rdi.getQuantita())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        saved.setCostoTotale(costoTotale);
        repairRepository.save(saved);

        return RepairMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<RepairResponse> search(StatoRepair stato, StatoRiparazione statoRiparazione, Pageable pageable) {
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
        return page.map(RepairMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<RepairResponse> getAll(Pageable pageable) {
        return repairRepository.findAll(pageable)
                .map(RepairMapper::toResponse);
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

        RepairMapper.updateEntity(repair, customer, request.stato(), request.statoRiparazione());
        Repair updated = repairRepository.save(repair);

        return RepairMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<RepairResponse> getAllNotConsegnato() {
        return repairRepository.findByStatoNotWithDetails(StatoRepair.CONSEGNATO).stream()
                .map(RepairMapper::toResponse)
                .toList();
    }

    @Transactional
    public RepairResponse updateStato(Long id, UpdateStatoRepairRequest request) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Repair not found"));

        if (request.stato() != null) {
            if (request.stato() == StatoRepair.CONSEGNATO && repair.getDetails().getDataRiconsegnaEffettiva() == null) {
                repair.getDetails().setDataRiconsegnaEffettiva(LocalDateTime.now());
            }
            repair.setStato(request.stato());
        }
        if (request.statoRiparazione() != null) {
            repair.setStatoRiparazione(request.statoRiparazione());
        }
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
