package com.saksham.userservice.payload;

public class LoginResponse {
    private Long userId;
    private String email;
    private String token;

    // Default Constructor
    public LoginResponse(){
        super();
    }

    // Parameterized Constructor
    public LoginResponse(Long userId, String email, String token) {
        this.userId = userId;
        this.email = email;
        this.token = token;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
