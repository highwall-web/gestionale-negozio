package com.hgw.gestionale.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateCustomerRequest(
        @NotBlank
        String nome,

        @NotBlank
        String cognome,

        @NotBlank
        @Email
        String email,

        String indirizzo,

        String citta,

        @Pattern(regexp = "\\d{5}", message = "CAP must be 5 digits")
        String cap,

        @NotBlank
        String telefono,

        String telefonoSecondario
) {
}
