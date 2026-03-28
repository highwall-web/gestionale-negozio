package com.hgw.gestionale.auth.dto;

import com.hgw.gestionale.user.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest (
        @NotBlank
        String username,
        @NotBlank
        String nome,
        @NotBlank
        String email,
        @NotBlank
        String password,
        @NotNull
        Role role
){
}
