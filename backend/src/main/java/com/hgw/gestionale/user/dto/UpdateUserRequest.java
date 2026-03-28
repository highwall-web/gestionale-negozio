package com.hgw.gestionale.user.dto;

public record UpdateUserRequest(
        String nome,
        String email,
        String password
) {
}
