package com.simba.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private boolean enabled = false;

    private String verificationToken;

    private String resetToken;
    private java.time.LocalDateTime resetTokenExpiry;

    // GOOGLE AUTH START
    @Column(nullable = false)
    private String provider = "LOCAL";
    // GOOGLE AUTH END

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch managedBranch;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public java.time.LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(java.time.LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }
    // GOOGLE AUTH START
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    // GOOGLE AUTH END
    public Branch getManagedBranch() { return managedBranch; }
    public void setManagedBranch(Branch managedBranch) { this.managedBranch = managedBranch; }
}
