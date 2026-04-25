package com.simba.controller;

import com.simba.dto.GoogleAuthRequestDTO;
import com.simba.dto.LoginRequestDTO;
import com.simba.dto.LoginResponseDTO;
import com.simba.dto.SignupRequestDTO;
import com.simba.service.AuthService;
// GOOGLE AUTH START
import com.simba.service.GoogleOAuthService;
// GOOGLE AUTH END
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    // GOOGLE AUTH START
    private final GoogleOAuthService googleOAuthService;

    public AuthController(AuthService authService, GoogleOAuthService googleOAuthService) {
        this.authService = authService;
        this.googleOAuthService = googleOAuthService;
    }
    // GOOGLE AUTH END

    @PostMapping("/signup")
    public LoginResponseDTO signup(@RequestBody SignupRequestDTO request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @GetMapping("/verify")
    public String verify(@RequestParam String token) {
        authService.verifyEmail(token);
        return "Email verified successfully. You can now log in.";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return "Password reset link sent to your email.";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return "Password has been reset successfully.";
    }

    @PostMapping("/google")
    public LoginResponseDTO googleLogin(@RequestBody GoogleAuthRequestDTO request) throws Exception {
        // GOOGLE AUTH START
        return googleOAuthService.authenticateGoogleUser(request.getToken());
        // GOOGLE AUTH END
    }
}
