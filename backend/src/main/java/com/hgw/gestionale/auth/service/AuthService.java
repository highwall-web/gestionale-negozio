package com.hgw.gestionale.auth.service;

import com.hgw.gestionale.auth.dto.LoginRequest;
import com.hgw.gestionale.auth.dto.LoginResponse;
import com.hgw.gestionale.auth.dto.RegisterRequest;
import com.hgw.gestionale.user.entity.Role;
import com.hgw.gestionale.user.entity.User;
import com.hgw.gestionale.user.repository.UserRepository;
import com.hgw.gestionale.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        User user = User.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.COMMESSO)
                .enabled(true)
                .build();
        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtService.generateToken(request.username());

        return new LoginResponse(token);
    }
}
