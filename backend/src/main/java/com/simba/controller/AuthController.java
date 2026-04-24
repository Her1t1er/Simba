package com.simba.controller;

import com.simba.dto.GoogleAuthRequestDTO;
import com.simba.dto.LoginRequestDTO;
import com.simba.dto.LoginResponseDTO;
import com.simba.dto.SignupRequestDTO;
import com.simba.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public LoginResponseDTO signup(@RequestBody SignupRequestDTO request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public LoginResponseDTO googleLogin(@RequestBody GoogleAuthRequestDTO request) {
        return authService.googleLogin(request);
    }
}
