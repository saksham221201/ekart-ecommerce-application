package com.saksham.userservice.controller;

import com.saksham.userservice.entity.User;
import com.saksham.userservice.payload.LoginRequest;
import com.saksham.userservice.payload.LoginResponse;
import com.saksham.userservice.service.AuthService;
import com.saksham.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        String token = authService.authenticateUser(loginRequest);
        User existingUser = userService.getUserByEmail(loginRequest.getEmail());
        LoginResponse loginResponse = new LoginResponse(existingUser.getUserId(), loginRequest.getEmail(), token);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
}
