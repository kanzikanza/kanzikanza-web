package com.example.restservice.security.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.config.kakao.KakaoApi.KakaoOpenIdToken;
import com.example.restservice.config.kakao.KakaoApi.OAuthToken;
import com.example.restservice.global.dto.ResponseDTO;
import com.example.restservice.security.JwtIssuer;
import com.example.restservice.security.dto.LoginReqponse;
import com.example.restservice.security.dto.LoginRequest;
import com.example.restservice.security.dto.UserPrincipal;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.usercustomize.persistence.usercustomizeRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Base64;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

        private final PasswordEncoder passwordEncoder;
        private final JwtIssuer jwtIssuer;
        private final AuthenticationManager authenticationManager;
        private final UserService userService;
        private final KakaoApi kakaoApi;
        private final usercustomizeRepository UsercustomizeRepository;

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
                                .accessToken(token)
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
                        UsercustomizeRepository.insertUserCustomize(registerUserModel.getId());
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
        @GetMapping("/auth/Oauth2/KakaoLogin")
        public ResponseEntity<Map<String,String>>  ClientKakaoLogin() {
            //TODO: process POST request
        //     RestTemplate restTemplate = new RestTemplate();
        //     ResponseEntity<String> response = restTemplate.getForEntity("https://kauth.kakao.com/oauth/authorize", String.class);
        //     return response;
        Map<String, String> links = new HashMap<>();
        links.put("link", "https://kauth.kakao.com/oauth/authorize");
        links.put("redirect", "http://localhost:8080/auth/Oauth2/KakaoToken");
        // links.put("redirect", "http://localhost:3000/auth");
        
        return ResponseEntity.status(HttpStatus.OK).body(links);
        }

        @GetMapping("/auth/Oauth2/KakaoToken")
        public ResponseEntity<?> KakaoLoginServer(@RequestParam String code) {
                try
                {       
                        OAuthToken token = kakaoApi.getOAuthToken(code);  
                        String str = token.getId_token();
                        String[] whatIneed = str.split("\\.");
                        KakaoOpenIdToken kakaoOpenIdToken = kakaoApi.getOpenIdToken(new String(Base64.getDecoder().decode(whatIneed[1]), StandardCharsets.UTF_8));
                        if (userService.existsByEmail(kakaoOpenIdToken.getSub()) == false)
                        {
                                UserModel user = UserModel.builder()
                                .email(kakaoOpenIdToken.getSub())
                                .password(passwordEncoder.encode(kakaoOpenIdToken.getSub()))
                                .build();
                
                                UserModel registerUserModel = userService.create(user);
                                UsercustomizeRepository.insertUserCustomize(registerUserModel.getId());
                                var MyAccesstoken = jwtIssuer.issue(registerUserModel.getId(),
                                                registerUserModel.getEmail(),
                                                Arrays.stream(registerUserModel.getRole().split(", "))
                                                                .collect((Collectors.toList())));
                                LoginReqponse loginReqponse = LoginReqponse.builder().accessToken(MyAccesstoken).build();
                                return ResponseEntity.ok().body(loginReqponse);
                        }
                        else
                        {
                                var authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(kakaoOpenIdToken.getSub(), kakaoOpenIdToken.getSub()));
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                var principal = (UserPrincipal) authentication.getPrincipal();
                
                                var roles = principal.getAuthorities().stream()
                                                .map(GrantedAuthority::getAuthority)
                                                .toList();
                                var MyAccesstoken = jwtIssuer.issue(principal.getUserId(), principal.getEmail(), roles);
                                return ResponseEntity.ok().body(LoginReqponse.builder()
                                .accessToken(MyAccesstoken)
                                .build());
                        }
                }
                        catch (Exception e) {
                        ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
                        return ResponseEntity
                                        .badRequest()
                                        .body(responseDTO);
                }
        }
        


}
