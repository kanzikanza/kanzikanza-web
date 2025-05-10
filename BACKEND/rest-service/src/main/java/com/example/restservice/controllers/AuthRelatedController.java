package com.example.restservice.controllers;

import com.example.restservice.dtos.UserUniteDtos;
// import com.example.restservice.dtos.UserUniteDtos.DefaultProfile;
import com.example.restservice.security.dto.ProfileRequest;
import com.example.restservice.security.service.AuthService;
import com.google.gson.JsonSyntaxException;

import org.springframework.web.bind.annotation.*;
import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.config.kakao.KakaoApi.KakaoOpenIdToken;
import com.example.restservice.config.kakao.KakaoApi.OAuthToken;
import com.example.restservice.global.dto.ResponseDTO;
import com.example.restservice.security.JwtIssuer;

import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthRelatedController {

        private final UserService userService;
        private final KakaoApi kakaoApi;
        private final AuthService authService;
        @Value("${spring.myurl}")
        private String origin;

        @PatchMapping("/auth/setDefaultProfile")
        public ResponseEntity<?> setDefaultProfile(@RequestBody ProfileRequest profileRequest) {
                try {
                        UserModel userModel = userService.findCurrentUser();
                        userModel.setUserNickname(profileRequest.getNickname());
                        userModel.setUserProfileChoice(profileRequest.getProfileIndex());
                        userService.create(userModel);
                        return ResponseEntity.ok("프로필 변경이 완료되었습니다");
                } catch (NoSuchElementException e) {
                        log.info(e.getMessage());
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없습니다");
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }
        }

        @GetMapping("/auth/getDefaultProfile")
        public ResponseEntity<?> getDefaultProfile() {
                try {
                        UserModel userModel = userService.findCurrentUser();
                        UserUniteDtos.DefaultProfile defaultProfile = UserUniteDtos.DefaultProfile.builder()
                                        .nickname(userModel.getUserNickname())
                                        .profileIndex(userModel.getUserProfileChoice())
                                        .userStreakDays(userModel.getUserStreakDays())
                                        .build();
                        return ResponseEntity.status(HttpStatus.OK).body(defaultProfile);

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }
        }

        @GetMapping("/auth/getStreakDay")
        public ResponseEntity<?> getStreakDay() {
                try {
                        UserModel userModel = userService.findCurrentUser();
                        UserUniteDtos.DefaultProfile defaultProfile = UserUniteDtos.DefaultProfile.builder()
                                        .userStreakDays(userModel.getUserStreakDays())
                                        .build();
                        return ResponseEntity.status(HttpStatus.OK).body(defaultProfile);

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }
        }

        @GetMapping("/auth/getSimpProfile")
        public ResponseEntity<?> getSimpProfile() {
                try {
                        UserModel userModel = userService.findCurrentUser();
                        UserUniteDtos.DefaultProfile defaultProfile = UserUniteDtos.DefaultProfile.builder()
                                        .nickname(userModel.getUserNickname())
                                        .profileIndex(userModel.getUserProfileChoice())
                                        .build();
                        return ResponseEntity.status(HttpStatus.OK).body(defaultProfile);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }
        }

        @GetMapping("/auth/Oauth2/KakaoLogin")
        public ResponseEntity<Map<String, String>> ClientKakaoLogin() {
                // TODO: process POST request
                Map<String, String> links = new HashMap<>();
                links.put("link", "https://kauth.kakao.com/oauth/authorize");
                links.put("redirect", origin + "/auth/Oauth2/KakaoToken");
                return ResponseEntity.status(HttpStatus.OK).body(links);
        }

        @PostMapping("/auth/Oauth2/updateToken")
        public ResponseEntity<?> updateToken(@RequestBody UserUniteDtos.UpdateRequest updateRequest) {

                try {
                        OAuthToken oAuthToken = kakaoApi.updateToken(updateRequest.getRefreshToken());

                        // 리턴
                        UserUniteDtos.LoginResponse loginResponse = UserUniteDtos.LoginResponse.builder()
                                        .accessToken(oAuthToken.getAccess_token())
                                        .refreshToken(oAuthToken.getRefresh_token())
                                        .build();
                        // 코드를 받을거임
                        return ResponseEntity.status(HttpStatus.CREATED).body(loginResponse);
                } catch (HttpClientErrorException | JsonSyntaxException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 리프레쉬 토큰 정보");
                }
        }

        @GetMapping("/auth/debug/getUserName")
        public ResponseEntity<?> getUserName() {
                try {
                        return ResponseEntity.status(HttpStatus.OK).body(userService.findCurrentUser().getUserEmail());
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
                }
        }

        @GetMapping("/auth/isLoggedIn")
        public ResponseEntity<?> isLoggedIn() {
                return ResponseEntity.status(HttpStatus.OK).body("login success".toString());
        }

        @GetMapping("/auth/Oauth2/KakaoToken")
        public ResponseEntity<?> KakaoLoginServer(@RequestParam String code) {
                log.info("Request Arrive: /auth/Oauth2/KakaoToken params : " + code);
                try {
                        OAuthToken token = kakaoApi.getOAuthToken(code);
                        String str = token.getId_token();
                        log.info(str);
                        String[] whatIneed = str.split("\\.");
                        KakaoOpenIdToken kakaoOpenIdToken = kakaoApi.getOpenIdToken(
                                        new String(Base64.getDecoder().decode(whatIneed[1]), StandardCharsets.UTF_8));

                        authService.signUp(token.getAccess_token());
                        UserUniteDtos.LoginResponse loginResponse = UserUniteDtos.LoginResponse.builder()
                                        .refreshToken(token.getRefresh_token())
                                        .accessToken(token.getAccess_token())
                                        .build();

                        log.info("Request Handle: /auth/Oauth2/KakaoToken params : " + code);
                        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);

                } catch (Exception e) {
                        ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
                        return ResponseEntity
                                        .badRequest()
                                        .body(responseDTO);
                }
        }

}
