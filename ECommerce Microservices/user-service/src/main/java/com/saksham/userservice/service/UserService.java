package com.saksham.userservice.service;

import com.saksham.userservice.entity.User;

import java.util.List;

public interface UserService {
    User addUser(User user);
    List<User> getAllUsers();
    User getUserById(Long userId);
    User getUserByEmail(String email);
    User updateUser(Long userId, User user);
}
