package com.example.restservice.security.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.global.dto.ResponseDTO;
import com.example.restservice.security.JwtIssuer;
import com.example.restservice.security.dto.LoginReqponse;
import com.example.restservice.security.dto.LoginRequest;
import com.example.restservice.security.dto.UserPrincipal;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class AuthController {

        private final PasswordEncoder passwordEncoder;
        private final JwtIssuer jwtIssuer;
        private final AuthenticationManager authenticationManager;
        private final UserService userService;

        @PostMapping("/auth/login")
        public LoginReqponse login(@RequestBody @Validated LoginRequest request) {
                // TODO: process POST request

                var authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                var principal = (UserPrincipal) authentication.getPrincipal();

                var roles = principal.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList();

                var token = jwtIssuer.issue(principal.getUserId(), principal.getEmail(), roles);
                return LoginReqponse.builder()
                                .accessToken(
                                                token)
                                .build();
        }

        @PostMapping("/auth/signup")
        public ResponseEntity<?> signup(@RequestBody LoginRequest request) {
                // TODO: process POST request
                try {
                        if (request == null || request.getPassword() == null) {
                                throw new RuntimeJsonMappingException("INVALID PASSWORD");
                        }
                        UserModel user = UserModel.builder()
                                        .email(request.getEmail())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .build();
                        UserModel registerUserModel = userService.create(user);
                        var token = jwtIssuer.issue(registerUserModel.getId(),
                                        registerUserModel.getEmail(),
                                        Arrays.stream(registerUserModel.getRole().split(", "))
                                                        .collect((Collectors.toList())));
                        LoginReqponse loginReqponse = LoginReqponse.builder().accessToken(token).build();
                        return ResponseEntity.ok().body(loginReqponse);
                } catch (Exception e) {
                        ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
                        return ResponseEntity
                                        .badRequest()
                                        .body(responseDTO);
                }

        }

}
