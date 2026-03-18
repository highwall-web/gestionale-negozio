package com.hgw.gestionale.statorepair.dto;

public record StatoRepairResponse(
        Long id,
        String nome,
        String colore,
        Integer position
) {
}
