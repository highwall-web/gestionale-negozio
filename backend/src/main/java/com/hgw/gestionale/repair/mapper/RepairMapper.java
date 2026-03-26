package com.hgw.gestionale.repair.mapper;

import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.mapper.CustomerMapper;
import com.hgw.gestionale.product.mapper.ProductMapper;
import com.hgw.gestionale.repair.dto.RepairResponse;
import com.hgw.gestionale.repair.entity.Repair;
import com.hgw.gestionale.repairdetails.mapper.RepairDetailsMapper;
import com.hgw.gestionale.statorepair.entity.StatoRepair;
import com.hgw.gestionale.statorepair.mapper.StatoRepairMapper;
import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;
import com.hgw.gestionale.statoriparazione.mapper.StatoRiparazioneMapper;

public final class RepairMapper {

    private RepairMapper() {}

    public static Repair toEntity(Customer customer) {
        return Repair.builder()
                .customer(customer)
                .build();
    }

    public static RepairResponse toResponse(Repair repair) {
        return new RepairResponse(
                repair.getId(),
                CustomerMapper.toResponse(repair.getCustomer()),
                ProductMapper.toResponse(repair.getProduct()),
                RepairDetailsMapper.toResponse(repair.getDetails()),
                repair.getStato() != null ? StatoRepairMapper.toResponse(repair.getStato()) : null,
                repair.getStatoRiparazione() != null ? StatoRiparazioneMapper.toResponse(repair.getStatoRiparazione()) : null,
                repair.getCostoTotale()
        );
    }

    public static void updateEntity(Repair repair, Customer customer,
                                    StatoRepair stato, StatoRiparazione statoRiparazione) {
        repair.setCustomer(customer);
        repair.setStato(stato);
        repair.setStatoRiparazione(statoRiparazione);
    }
}
