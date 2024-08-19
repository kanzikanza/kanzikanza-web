package com.example.restservice.security.service;

import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.repository.UserKanzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final KakaoApi kakaoApi;
    private final UserService userService;
    private final UserKanzaRepository userKanzaRepository;
    public void signUp(String accessToken) throws RestClientException
    {
        KakaoApi.KakaoUserInfo kakaoUserInfo = kakaoApi.getKakaoUserInfo(accessToken);

        String userEmail = kakaoUserInfo.getKakao_account().getEmail();
        if (userService.existsByEmail(userEmail))
        {
            return;
        }

        UserModel user = UserModel.builder()
                .userEmail(userEmail)
                .build();
        UserModel registerUserModel = userService.create(user);
        userKanzaRepository.CreateAllRelationsByUser(registerUserModel.getUserIndex());
    }
}
