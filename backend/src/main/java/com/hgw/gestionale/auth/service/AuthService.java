package com.hgw.gestionale.auth.service;

import com.hgw.gestionale.auth.dto.LoginRequest;
import com.hgw.gestionale.auth.dto.LoginResponse;
import com.hgw.gestionale.auth.dto.RegisterRequest;
import com.hgw.gestionale.auth.entity.RefreshToken;
import com.hgw.gestionale.auth.repository.RefreshTokenRepository;
import com.hgw.gestionale.security.JwtService;
import com.hgw.gestionale.user.entity.Role;
import com.hgw.gestionale.user.entity.User;
import com.hgw.gestionale.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${auth.refresh-token.expiration-days}")
    private int refreshTokenExpirationDays;

    @Value("${auth.refresh-token.expiration-days-remember-me}")
    private int refreshTokenExpirationDaysRememberMe;

    @Value("${auth.refresh-token.cookie-secure}")
    private boolean cookieSecure;

    public void register(RegisterRequest request) {
        User user = User.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.COMMESSO)
                .enabled(true)
                .build();
        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getRole().name());
        String refreshTokenValue = jwtService.generateRefreshToken();
        boolean rememberMe = Boolean.TRUE.equals(request.rememberMe());

        LocalDateTime expiresAt = rememberMe
                ? LocalDateTime.now().plusDays(30)
                : LocalDateTime.now().plusDays(1);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(user)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshTokenValue)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/auth")
                .maxAge(rememberMe ? 60L * 60 * 24 * refreshTokenExpirationDaysRememberMe : 60L * 60 * 24 * refreshTokenExpirationDays)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return new LoginResponse(accessToken);
    }

    public LoginResponse refresh(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenValue = extractRefreshTokenFromCookies(request);

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> {
                        removeTokenFromCookies(response);
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not found");
                });

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                logout(request, response);
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked");
        }

        String accessToken = jwtService.generateAccessToken(
                refreshToken.getUser().getUsername(),
                refreshToken.getUser().getRole().name()
        );

        return new LoginResponse(accessToken);
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No cookies");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("refresh_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token cookie not found");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenValue = extractRefreshTokenFromCookies(request);

        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);

        removeTokenFromCookies(response);
    }

    private void removeTokenFromCookies(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}
