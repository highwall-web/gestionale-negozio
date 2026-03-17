package com.hgw.gestionale.auth.controller;

import com.hgw.gestionale.auth.dto.LoginRequest;
import com.hgw.gestionale.auth.dto.LoginResponse;
import com.hgw.gestionale.auth.dto.RegisterRequest;
import com.hgw.gestionale.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @PreAuthorize( "hasRole('ADMIN')")
    public void register(@RequestBody RegisterRequest request) {
        log.info("AuthController.register richiesta registrazione utente: {}", request.username());
        authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        log.info("AuthController.login tentativo login utente: {}", request.username());
        return authService.login(request, response);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(HttpServletRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authService.logout(request, response);
    }
}
