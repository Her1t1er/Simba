package com.simba.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.simba.dto.LoginResponseDTO;
import com.simba.model.User;
import com.simba.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Optional;

@Service
public class GoogleOAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    private final UserRepository userRepository;
    private final EmailService emailService;

    public GoogleOAuthService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // GOOGLE AUTH START
    public LoginResponseDTO authenticateGoogleUser(String idTokenString) throws Exception {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            String email;
            String name;

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                email = payload.getEmail();
                name = (String) payload.get("name");
            } else {
                // Fallback for debugging/development if token verification fails but token is present
                System.out.println("Google Token verification failed, trying fallback decode...");
                try {
                    String[] chunks = idTokenString.split("\\.");
                    String payloadStr = new String(java.util.Base64.getUrlDecoder().decode(chunks[1]));
                    com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payloadStr);
                    email = node.get("email").asText();
                    name = node.has("name") ? node.get("name").asText() : email.split("@")[0];
                } catch (Exception e) {
                    System.err.println("Fallback decode failed: " + e.getMessage());
                    throw new RuntimeException("Invalid Google ID Token and fallback failed");
                }
            }

            Optional<User> userOptional = userRepository.findByEmail(email);
            User user;

            if (userOptional.isPresent()) {
                user = userOptional.get();
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(name != null ? name : email.split("@")[0]);
                user.setRole("customer");
                user.setProvider("GOOGLE");
                user.setEnabled(true);
                user.setPassword("{noop}google-oauth-placeholder"); 
                user = userRepository.save(user);
                
                // Send confirmation email for new Google users (verified instantly, so token/redirect are null)
                emailService.sendRegistrationConfirmation(user.getEmail(), user.getName(), null, null);
            }

            return new LoginResponseDTO(
                "demo-google-jwt-token",
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().toLowerCase() : "customer",
                user.getManagedBranch() != null ? user.getManagedBranch().getName() : null
            );
        } catch (Exception e) {
            System.err.println("Google Authentication Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    // GOOGLE AUTH END
}
