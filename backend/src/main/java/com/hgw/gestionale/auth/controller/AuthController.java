package com.hgw.gestionale.auth.controller;

import com.hgw.gestionale.auth.dto.LoginRequest;
import com.hgw.gestionale.auth.dto.LoginResponse;
import com.hgw.gestionale.auth.dto.RegisterRequest;
import com.hgw.gestionale.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @PreAuthorize( "hasRole('ADMIN')")
    public void register(@RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
