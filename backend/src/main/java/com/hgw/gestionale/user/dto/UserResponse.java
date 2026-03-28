package com.hgw.gestionale.user.dto;

import com.hgw.gestionale.user.entity.Role;

public record UserResponse(
        Long id,
        String username,
        String nome,
        String email,
        Role role,
        Boolean enabled
) {
}
