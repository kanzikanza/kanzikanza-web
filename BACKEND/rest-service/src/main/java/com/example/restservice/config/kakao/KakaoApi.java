package com.example.restservice.config.kakao;

import org.springframework.boot.json.JsonParser;
<<<<<<< HEAD
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
=======
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
>>>>>>> 37334aa (chore : 머지 처리)
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

<<<<<<< HEAD
import com.google.gson.Gson;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Component
public class KakaoApi {

    // public String getAccessToken(String code) {
    // String accessToken = "";
    // String refreshToken = "";
    // String reqUrl = "https://kauth.kakao.com/oauth/token";

    // try {
    // RestTemplate restTemplate = new RestTemplate();

    // HttpHeaders headers = new HttpHeaders();
    // headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    // MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
    // map.add("grant_type", "authorization_code");
    // map.add("client_id", kakaoApiKey);
    // map.add("redirect_uri", kakaoRedirectUri);
    // map.add("code", code);

    // HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map,
    // headers);

    // ResponseEntity<String> response = restTemplate.postForEntity(reqUrl, request,
    // String.class);

    // log.info("[KakaoApi.getAccessToken] responseCode = {}",
    // response.getStatusCodeValue());

    // if (response.getStatusCode() == HttpStatus.OK) {
    // String result = response.getBody();
    // log.info("responseBody = {}", result);

    // JsonParser parser = new JsonParser();
    // JsonElement element = parser.parse(result);
    // accessToken = element.getAsJsonObject().get("access_token").getAsString();
    // refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();
    // } else {
    // log.error("Failed to get access token. Status code: {}",
    // response.getStatusCodeValue());
    // }
    // } catch (Exception e) {
    // log.error("Error while getting access token: {}", e.getMessage());
    // e.printStackTrace();
    // }

    // return accessToken;
    // }

    public OAuthToken getOAuthToken(String code) {
        String reqUrl = "https://kauth.kakao.com/oauth/token";

        RestTemplate rt = new RestTemplate();

        // HttpHeader 오브젝트
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HttpBody 오브젝트
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "e0fa9c3226566a2dcda49e672fe892ac");
        params.add("redirect_uri", "http://localhost:8080/auth/Oauth2/KakaoToken");
        params.add("code", code);

        // http 바디(params)와 http 헤더(headers)를 가진 엔티티
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        // reqUrl로 Http 요청 , POST 방식
        ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.POST, kakaoTokenRequest, String.class);

        String responseBody = response.getBody();

        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(responseBody, OAuthToken.class);

        return oAuthToken;
    }

    public KakaoOpenIdToken getOpenIdToken(String code) {
        Gson gson = new Gson();
        KakaoOpenIdToken kakaoOpenIdToken = gson.fromJson(code, KakaoOpenIdToken.class);
        return kakaoOpenIdToken;
    }

    @Getter
    @Setter
    public class OAuthToken {
        private String token_type;
        private String access_token;
        private String id_token;
        private int expires_in;
        private String refresh_token;
        private String scope;

        // 생성자, 게터, 세터 등 필요한 코드 작성
    }

    @Getter
    @Setter
    public class KakaoOpenIdToken {
        private String aud;
        private String sub;
        private String auth_time;
        private String iss;
        private String nickname;
        private String exp;
        private String iat;
    }

=======
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class KakaoApi {

    public String getAccessToken(String code) {
        String accessToken = "";
        String refreshToken = "";
        String reqUrl = "https://kauth.kakao.com/oauth/token";

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("grant_type", "authorization_code");
            map.add("client_id", kakaoApiKey);
            map.add("redirect_uri", kakaoRedirectUri);
            map.add("code", code);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(reqUrl, request, String.class);

            log.info("[KakaoApi.getAccessToken] responseCode = {}", response.getStatusCodeValue());

            if (response.getStatusCode() == HttpStatus.OK) {
                String result = response.getBody();
                log.info("responseBody = {}", result);

                JsonParser parser = new JsonParser();
                JsonElement element = parser.parse(result);
                accessToken = element.getAsJsonObject().get("access_token").getAsString();
                refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();
            } else {
                log.error("Failed to get access token. Status code: {}", response.getStatusCodeValue());
            }
        } catch (Exception e) {
            log.error("Error while getting access token: {}", e.getMessage());
            e.printStackTrace();
        }

        return accessToken;
    }
>>>>>>> 37334aa (chore : 머지 처리)
}
