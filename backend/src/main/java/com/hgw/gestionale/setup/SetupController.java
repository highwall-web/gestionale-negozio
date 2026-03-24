package com.hgw.gestionale.setup;

import com.hgw.gestionale.auth.dto.RegisterRequest;
import com.hgw.gestionale.user.entity.Role;
import com.hgw.gestionale.user.entity.User;
import com.hgw.gestionale.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/setup", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SetupController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<String> setup(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.count() > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Setup already completed");
        }

        User admin = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin user created");
    }
}
