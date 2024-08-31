package com.example.restservice.user;

import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
        if (userModel == null || userModel.getUserEmail() == null) {
            throw new RuntimeJsonMappingException("Invalid argument");
        }
        final String email = userModel.getUserEmail();
        if (userRepository.existsByUserEmail(email)) {
            log.warn("email already existss {}", email);
            throw new RuntimeJsonMappingException("Username Already exists");
        }
//        userModel.setRole("ROLE_GUEST");
        return userRepository.save(userModel);
    }

    public UserModel findUserModelByUserKakaoSerial(Long id)
    {
        return userRepository.findUserModelByUserKakaoSerial(id);
    }

    public Optional<UserModel> findByEmail(String email) {
        var user = userRepository.findByUserEmail(email);
        if (user.equals(null))
            return Optional.empty();
        return Optional.of(user);
    }

    public UserModel findCurrentUser() throws NoSuchElementException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<UserModel> userOptional = findByEmail(username);
        UserModel user = null;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        }
        return user;
    }
    public boolean existsByEmail(String email)
    {
        return userRepository.existsByUserEmail(email);
    }

}
