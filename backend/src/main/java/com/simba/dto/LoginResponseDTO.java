package com.simba.dto;

public class LoginResponseDTO {
    private String token;
    private String name;
    private String email;
    private String role;
    private String branchName;

    public LoginResponseDTO(String token, String name, String email, String role, String branchName) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.branchName = branchName;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
}
