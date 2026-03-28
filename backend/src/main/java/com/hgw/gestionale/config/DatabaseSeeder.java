package com.hgw.gestionale.config;

import com.hgw.gestionale.user.entity.Role;
import com.hgw.gestionale.user.entity.User;
import com.hgw.gestionale.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Profile("locale")
@Configuration
public class DatabaseSeeder {
    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .nome("admin")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .email("m.m@m.it")
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created");
            }

        };
    }
}
