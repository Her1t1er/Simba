package com.simba.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendRegistrationConfirmation(String toEmail, String name, String token, String redirect) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify your Simba Market account");
        
        String verificationUrl = "http://localhost:3000/verify?token=" + token;
        if (redirect != null && !redirect.isEmpty()) {
            verificationUrl += "&redirect=" + redirect;
        }
        
        message.setText("Dear " + name + ",\n\n" +
                "Thank you for registering with Simba Market Rwanda.\n\n" +
                "Please click the link below to verify your email address and activate your account:\n" +
                verificationUrl + "\n\n" +
                "Once verified, you will be able to log in and complete your purchase.\n\n" +
                "Best regards,\n" +
                "The Simba Market Team");
        
        try {
            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            System.out.println("\n--- LOCAL DEV: VERIFICATION LINK ---");
            System.out.println(verificationUrl);
            System.out.println("------------------------------------\n");
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String name, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset your Simba Market password");
        
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        
        message.setText("Dear " + name + ",\n\n" +
                "We received a request to reset your password for your Simba Market account.\n\n" +
                "Please click the link below to set a new password:\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The Simba Market Team");
        
        try {
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send reset email to " + toEmail + ": " + e.getMessage());
            System.out.println("\n--- LOCAL DEV: PASSWORD RESET LINK ---");
            System.out.println(resetUrl);
            System.out.println("--------------------------------------\n");
        }
    }
}
