package com.hgw.gestionale.user.controller;

import com.hgw.gestionale.user.dto.UpdateUserRequest;
import com.hgw.gestionale.user.dto.UserResponse;
import com.hgw.gestionale.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {
        return userService.updateCurrentUser(authentication.getName(), request);
    }
}
