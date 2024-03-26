package com.example.restservice.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.user.model.UserModel;
import com.example.restservice.user.repository.UserRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public UserModel create(final UserModel userModel) {
        if (userModel == null || userModel.getEmail() == null) {
            throw new RuntimeJsonMappingException("Invalid argument");
        }
        final String email = userModel.getEmail();
        if (userRepository.existsByEmail(email)) {
            log.warn("email already existss {}", email);
            throw new RuntimeJsonMappingException("Username Already exists");
        }
        userModel.setRole("ROLE_GUEST");
        return userRepository.save(userModel);
    }

    public Optional<UserModel> findByEmail(String email) {
        var user = userRepository.findByEmail(email);
        if (user.equals(null))
            return Optional.empty();
        // userRepository.findByEmail(email);       
        // var user = new UserModel();
        // user.setId(1L);
        // user.setEmail(EXISTING_EMAIL);
        // user.setPassword("$2a$12$BfaDWPgHgVMTlEqvWtgNWuMPhHJ3OUkeaKT.8OyM6Rzf4yTISd.wa");
        // // test
        // user.setRole("ROLE_ADMIN");
        // user.setExtraInfo("My DD");
        return Optional.of(user);
    }
    public boolean existsByEmail(String email)
    {
        return userRepository.existsByEmail(email);
    }

}
