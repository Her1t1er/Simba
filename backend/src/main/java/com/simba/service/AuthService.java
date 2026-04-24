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

@Service
public class AuthService {
    private final UserRepository userRepository;
    
    @Value("${google.client.id:}")
    private String googleClientId;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponseDTO signup(SignupRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword("{noop}" + request.getPassword());
        user.setRole("customer");
        user = userRepository.save(user);

        return new LoginResponseDTO(
            "demo-jwt-token",
            user.getName(),
            user.getEmail(),
            user.getRole(),
            null
        );
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedPassword = user.getPassword();
            String inputPassword = request.getPassword();
            
            if (storedPassword.equals(inputPassword) || storedPassword.equals("{noop}" + inputPassword)) {
                return new LoginResponseDTO(
                    "demo-jwt-token",
                    user.getName(),
                    user.getEmail(),
                    user.getRole().toLowerCase(),
                    user.getManagedBranch() != null ? user.getManagedBranch().getName() : null
                );
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }

    public LoginResponseDTO googleLogin(GoogleAuthRequestDTO request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                // If verification fails but we want to allow it for testing without a valid client ID
                if (googleClientId == null || googleClientId.isEmpty()) {
                    return fallbackGoogleLogin(request.getToken());
                }
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            if (name == null) name = email.split("@")[0];

            return processGoogleUser(email, name);

        } catch (Exception e) {
            throw new RuntimeException("Failed to process Google authentication: " + e.getMessage());
        }
    }

    private LoginResponseDTO fallbackGoogleLogin(String token) {
        // Fallback logic for when Client ID is not configured (for dev)
        try {
            // This is what we had before, keep it only as an emergency fallback
            String[] chunks = token.split("\\.");
            if (chunks.length < 2) throw new RuntimeException("Invalid token");
            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payloadStr = new String(decoder.decode(chunks[1]));
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(payloadStr);
            
            String email = node.get("email").asText();
            String name = node.has("name") ? node.get("name").asText() : email.split("@")[0];
            return processGoogleUser(email, name);
        } catch (Exception e) {
            throw new RuntimeException("Fallback Google Auth failed: " + e.getMessage());
        }
    }

    private LoginResponseDTO processGoogleUser(String email, String name) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword("{noop}google-oauth-placeholder");
            user.setRole("customer");
            user = userRepository.save(user);
        }

        return new LoginResponseDTO(
            "demo-google-jwt-token",
            user.getName(),
            user.getEmail(),
            user.getRole().toLowerCase(),
            user.getManagedBranch() != null ? user.getManagedBranch().getName() : null
        );
    }
}
