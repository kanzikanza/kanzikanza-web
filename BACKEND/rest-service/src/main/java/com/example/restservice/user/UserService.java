package com.example.restservice.user;

import com.example.restservice.user.UserEntity;
import com.example.restservice.user.UserRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;

import lombok.extern.slf4j.Slf4j;

import org.apache.catalina.mbeans.UserMBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserEntity create(final UserEntity userEntity) {
        if (userEntity == null || userEntity.getUsername() == null) {
            throw new RuntimeJsonMappingException("Invalid arguments");
        }
        final String username = userEntity.getUsername();
        if (userRepository.existsByUsername(username)) {
            log.warn("Username already exists {}", username);
            throw new RuntimeJsonMappingException("Username Already exists");
        }
        return userRepository.save(userEntity);
    }

    public UserEntity getByCredentials(final String username, final String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }
}
