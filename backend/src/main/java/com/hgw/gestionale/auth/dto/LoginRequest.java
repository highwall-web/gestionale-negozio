package com.hgw.gestionale.auth.dto;

public record LoginRequest (
        String username,
        String password
){
}
