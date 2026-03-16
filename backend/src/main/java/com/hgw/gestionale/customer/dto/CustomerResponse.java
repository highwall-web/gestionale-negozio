package com.hgw.gestionale.customer.dto;

import jakarta.validation.constraints.NotBlank;

public record CustomerResponse(
        @NotBlank
        Long id,

        @NotBlank
        String nome,

        @NotBlank
        String cognome,

        @NotBlank
        String email,

        String indirizzo,

        String citta,

        String cap,

        @NotBlank
        String telefono,

        String telefonoSecondario
) {
}
