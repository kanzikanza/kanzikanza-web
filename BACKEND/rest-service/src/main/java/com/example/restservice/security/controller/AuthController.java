package com.example.restservice.security.controller;

import com.example.restservice.security.dto.ProfileRequest;
import com.example.restservice.userKanza.repository.UserKanzaRepository;
import org.springframework.web.bind.annotation.*;
import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.config.kakao.KakaoApi.KakaoOpenIdToken;
import com.example.restservice.config.kakao.KakaoApi.OAuthToken;
import com.example.restservice.global.dto.ResponseDTO;
import com.example.restservice.security.JwtIssuer;
import com.example.restservice.security.dto.LoginResponse;
import com.example.restservice.security.dto.LoginRequest;
import com.example.restservice.security.dto.UserPrincipal;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;

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
        private final UserKanzaRepository usercustomizeRepository;


        @PatchMapping("/auth/setDefaultProfile")
        public ResponseEntity<?> setDefaultProfile(@RequestBody ProfileRequest profileRequest)
        {
                try
                {
                        UserModel userModel = userService.findCurrentUser();
                        userModel.setUserNickname(profileRequest.getNickname());
                        userModel.setUserProfileChoice(profileRequest.getProfileIndex());
                        return ResponseEntity.ok("프로필 변경이 완료되었습니다");
                }
                catch (NoSuchElementException e)
                {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없습니다");
                }
                catch (Exception e)
                {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }
        }
        @PostMapping("/auth/login")
        public LoginResponse login(@RequestBody @Validated LoginRequest request) {
                // TODO: process POST request

                var authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                var principal = (UserPrincipal) authentication.getPrincipal();

                var roles = principal.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList();

                var token = jwtIssuer.issue(principal.getUserIndex(), principal.getUserEmail(), roles);
                return LoginResponse.builder()
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
                                        .userEmail(request.getEmail())
                                        .build();
                        UserModel registerUserModel = userService.create(user);
                        usercustomizeRepository.CreateAllRelationsByUser(registerUserModel.getUserIndex());
                        String token = jwtIssuer.issue(registerUserModel.getUserIndex(),
                                        registerUserModel.getUserEmail(),
                                        Arrays.stream("".split(", "))
                                                        .collect((Collectors.toList())));
                        LoginResponse loginResponse = LoginResponse.builder().accessToken(token).build();
                        return ResponseEntity.ok().body(loginResponse);
                } catch (Exception e) {
                        ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
                        return ResponseEntity
                                        .badRequest()
                                        .body(responseDTO);
                }
        }

        @GetMapping("/auth/Oauth2/KakaoLogin")
        public ResponseEntity<Map<String, String>> ClientKakaoLogin() {
                // TODO: process POST request
                // RestTemplate restTemplate = new RestTemplate();
                // ResponseEntity<String> response =
                // restTemplate.getForEntity("https://kauth.kakao.com/oauth/authorize",
                // String.class);
                // return response;
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
                                        .userEmail(kakaoOpenIdToken.getSub())
                                        .build();
                
                                UserModel registerUserModel = userService.create(user);
                                usercustomizeRepository.CreateAllRelationsByUser(registerUserModel.getUserIndex());
                                String MyAccesstoken = jwtIssuer.issue(registerUserModel.getUserIndex(),
                                                registerUserModel.getUserEmail(),
                                                Arrays.stream("".split(", "))
                                                                .collect((Collectors.toList())));
                                LoginResponse loginResponse = LoginResponse.builder().accessToken(MyAccesstoken).build();
                                return ResponseEntity.ok().body(loginResponse);
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
                                var MyAccesstoken = jwtIssuer.issue(principal.getUserIndex(), principal.getUserEmail(), roles);
                                return ResponseEntity.ok().body(LoginResponse.builder()
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
