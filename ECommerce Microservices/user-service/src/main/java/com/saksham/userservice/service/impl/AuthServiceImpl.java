package com.saksham.userservice.service.impl;

import com.saksham.userservice.constant.Constant;
import com.saksham.userservice.entity.User;
import com.saksham.userservice.exception.BadRequestException;
import com.saksham.userservice.payload.LoginRequest;
import com.saksham.userservice.service.AuthService;
import com.saksham.userservice.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    public AuthServiceImpl(UserService userService){
        this.userService = userService;
    }

    @Override
    public String authenticateUser(LoginRequest loginRequest) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        User existingUser = userService.getUserByEmail(loginRequest.getEmail());
        if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), existingUser.getPassword())){
            return generateJWTToken(loginRequest);
        }
        throw new BadRequestException("Incorrect Credentials!!", HttpStatus.BAD_REQUEST.value());
    }

    private String generateJWTToken(LoginRequest loginRequest) {
        User userInformation = userService.getUserByEmail(loginRequest.getEmail());
        Long userId = userInformation.getUserId();
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + Constant.ONE_HOUR);
        return Jwts.builder()
                .setSubject(loginRequest.getEmail())
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, Constant.SECRET_KEY)
                .compact();
    }
}
