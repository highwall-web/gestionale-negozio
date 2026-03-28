package com.hgw.gestionale.user.service;

import com.hgw.gestionale.user.dto.UpdateUserRequest;
import com.hgw.gestionale.user.dto.UserResponse;
import com.hgw.gestionale.user.entity.User;
import com.hgw.gestionale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateCurrentUser(String username, UpdateUserRequest request) {
        boolean nomeBlank     = request.nome()     == null || request.nome().isBlank();
        boolean emailBlank    = request.email()    == null || request.email().isBlank();
        boolean passwordBlank = request.password() == null || request.password().isBlank();

        if (nomeBlank && emailBlank && passwordBlank) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Almeno un campo deve essere valorizzato");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!nomeBlank)     user.setNome(request.nome());
        if (!emailBlank)    user.setEmail(request.email());
        if (!passwordBlank) user.setPasswordHash(passwordEncoder.encode(request.password()));

        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getNome(),
                user.getEmail(),
                user.getRole(),
                user.getEnabled()
        );
    }
}
