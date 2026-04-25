package com.simba.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.simba.dto.GoogleAuthRequestDTO;
import com.simba.dto.LoginRequestDTO;
import com.simba.dto.LoginResponseDTO;
import com.simba.dto.SignupRequestDTO;
import com.simba.model.User;
import com.simba.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public LoginResponseDTO signup(SignupRequestDTO request) {
        if (request == null || request.getEmail() == null) {
            throw new RuntimeException("Invalid signup request");
        }
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        String token = UUID.randomUUID().toString();
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword("{noop}" + request.getPassword());
        user.setRole("customer");
        user.setEnabled(false);
        user.setVerificationToken(token);
        user = userRepository.save(user);

        // Send confirmation email
        emailService.sendRegistrationConfirmation(user.getEmail(), user.getName(), token, request.getRedirect());

        return new LoginResponseDTO(
            null,
            user.getName(),
            user.getEmail(),
            user.getRole().toLowerCase(),
            null
        );
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email."));
        
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token."));
        
        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired.");
        }
        
        user.setPassword("{noop}" + newPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Invalid credentials");
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if (!user.isEnabled()) {
                throw new RuntimeException("Please verify your email before logging in.");
            }

            String storedPassword = user.getPassword();
            String inputPassword = request.getPassword();
            
            if (storedPassword != null && (storedPassword.equals(inputPassword) || storedPassword.equals("{noop}" + inputPassword))) {
                return new LoginResponseDTO(
                    "demo-jwt-token",
                    user.getName(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().toLowerCase() : "customer",
                    user.getManagedBranch() != null ? user.getManagedBranch().getName() : null
                );
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }
}
