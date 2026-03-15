package com.hgw.gestionale.config;

import com.hgw.gestionale.entity.Role;
import com.hgw.gestionale.entity.User;
import com.hgw.gestionale.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created");
            }

        };
    }
}
