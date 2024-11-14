package com.saksham.userservice.service.impl;

import com.saksham.userservice.dao.UserDao;
import com.saksham.userservice.entity.User;
import com.saksham.userservice.exception.DuplicateEntryException;
import com.saksham.userservice.exception.EmptyInputException;
import com.saksham.userservice.exception.ResourceNotFoundException;
import com.saksham.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    public UserServiceImpl(UserDao userDao){
        this.userDao = userDao;
    }

    @Override
    public User addUser(User user) {
        // Checking if any of the fields is Empty or not
        if(user.getEmail().isBlank() || user.getFirstName().isBlank() || user.getLastName().isBlank() || user.getPassword().isBlank()){
            throw new EmptyInputException("Input cannot be null!!", HttpStatus.BAD_REQUEST.value());
        }

        // Checking if the user with the given email already exists or not
        Optional<User> optionalUser = userDao.findByEmail(user.getEmail());
        if(optionalUser.isPresent()){
            throw new DuplicateEntryException("User already exists with email: " + user.getEmail(), HttpStatus.BAD_REQUEST.value());
        }

        // Encrypting the Password
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String encryptedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        return userDao.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        // Checking if the user with the given userId already exists or not
        Optional<User> optionalUser = userDao.findById(userId);
        if(optionalUser.isEmpty()){
            throw new ResourceNotFoundException("User not found with id: " + userId, HttpStatus.NOT_FOUND.value());
        }
        return optionalUser.get();
    }

    @Override
    public User getUserByEmail(String email) {
        Optional<User> optionalUser = userDao.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new ResourceNotFoundException("User not found with email: " + email, HttpStatus.NOT_FOUND.value());
        }
        return optionalUser.get();

    }

    @Override
    public User updateUser(Long userId, User user) {
        // Checking if any of the inputs is null
        if(user.getEmail().isBlank() || user.getFirstName().isBlank() || user.getLastName().isBlank() || user.getPassword().isBlank()){
            throw new EmptyInputException("Input cannot be null", HttpStatus.BAD_REQUEST.value());
        }

        Optional<User> existingUser = userDao.findById(userId);
        if(existingUser.isEmpty()){
            throw new ResourceNotFoundException("User not found with id: " + userId, HttpStatus.NOT_FOUND.value());
        }

        User updateUser = existingUser.get();
        updateUser.setEmail(user.getEmail());
        updateUser.setFirstName(user.getFirstName());
        updateUser.setLastName(user.getLastName());

        // Encrypting the Password
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String encryptedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        updateUser.setPassword(encryptedPassword);

        return userDao.save(updateUser);
    }
}
