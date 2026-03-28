package com.hgw.gestionale.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest (
        @NotBlank
        String username,
        @NotBlank
        String nome,
        @NotBlank
        String email,
        @NotBlank
        String password
){
}
