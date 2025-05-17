package com.example.restservice.security.service;

import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.repository.UserKanzaRepository;
import com.example.restservice.userTest.service.UserTestService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final KakaoApi kakaoApi;
    private final UserService userService;
    private final UserTestService userTestService;

    public UserModel signUp(String accessToken) throws RestClientException {
        KakaoApi.KakaoUserInfo kakaoUserInfo = kakaoApi.getKakaoUserInfo(accessToken);

        String userEmail = kakaoUserInfo.getKakao_account().getEmail();
        Long userKakaoSerial = kakaoUserInfo.getId();
        if (userService.existsByEmail(userEmail)) {
            return userService.findByEmail(userEmail).orElseThrow();
        }

        UserModel user = UserModel.builder()
                .userEmail(userEmail)
                .userKakaoSerial(userKakaoSerial)
                .build();
        UserModel registerUserModel = userService.create(user);
        // userKanzaRepository.CreateAllRelationsByUser(registerUserModel.getUserIndex());

        return registerUserModel;
    }

}
