package com.saksham.userservice.service;

import com.saksham.userservice.payload.LoginRequest;

public interface AuthService {
    String authenticateUser(LoginRequest loginRequest);
}
