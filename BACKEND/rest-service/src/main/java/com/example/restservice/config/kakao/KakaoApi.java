package com.example.restservice.config.kakao;

import com.example.restservice.dtos.UserUniteDtos;
import com.google.gson.JsonSyntaxException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JsonParser;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.security.PublicKey;
import java.time.LocalDateTime;

@Slf4j
@Component
public class KakaoApi {
    @Value("${kakao.api_key}")
    private String clientId;

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
        params.add("client_id", clientId);
        params.add("redirect_uri", "http://localhost:8080/auth/Oauth2/KakaoToken");
        params.add("code", code);

        // http 바디(params)와 http 헤더(headers)를 가진 엔티티
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        // reqUrl로 Http 요청 , POST 방식
        ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.POST, kakaoTokenRequest, String.class);

        String responseBody = response.getBody();

        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(responseBody, OAuthToken.class);
        log.info(oAuthToken.getId_token());
        return oAuthToken;
    }

    public UserUniteDtos.ValidateResponse getValidUser(String token) throws  RestClientException
    {
        String reqUrl = "https://kapi.kakao.com/v1/user/access_token_info";
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.GET, kakaoTokenRequest, String.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RestClientException("Failed to update token. HTTP Status: " + response.getStatusCode());
        }
        String responseBody = response.getBody();
        Gson gson = new Gson();
        return gson.fromJson(responseBody, UserUniteDtos.ValidateResponse.class);

    }
    public OAuthToken updateToken(String code) throws RestClientException, JsonSyntaxException
    {
        String reqUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "refresh_token");
        params.add("client_id", clientId);
        params.add("refresh_token", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);
        try {
            ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.POST, kakaoTokenRequest, String.class);

            // 상태 코드가 200 OK가 아닌 경우 예외 발생
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RestClientException("Failed to update token. HTTP Status: " + response.getStatusCode());
            }

            // JSON 파싱 및 객체 생성
            String responseBody = response.getBody();
            Gson gson = new Gson();
            return gson.fromJson(responseBody, OAuthToken.class);

        } catch (HttpClientErrorException | JsonSyntaxException e) {
            // 구체적인 예외 처리
            throw new RestClientException("Failed to update token due to an error: " + e.getMessage(), e);
        }
    }


    public KakaoOpenIdToken getOpenIdToken(String code) {
        Gson gson = new Gson();
        KakaoOpenIdToken kakaoOpenIdToken = gson.fromJson(code, KakaoOpenIdToken.class);
        return kakaoOpenIdToken;
    }

    public KakaoUserInfo getKakaoUserInfo(String code) throws RestClientException, JsonSyntaxException
    {
        String reqUrl = "https://kapi.kakao.com/v2/user/me";
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + code);
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("property_keys", "[\"kakao_account.email\", \"kakao_account.profile\"]");

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.POST, kakaoTokenRequest, String.class);

            // 상태 코드가 200 OK가 아닌 경우 예외 발생
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RestClientException("Failed to update token. HTTP Status: " + response.getStatusCode());
            }
            // JSON 파싱 및 객체 생성
            String responseBody = response.getBody();
            Gson gson = new Gson();
            return gson.fromJson(responseBody, KakaoUserInfo.class);

        } catch (HttpClientErrorException | JsonSyntaxException e) {
            // 구체적인 예외 처리
            throw new RestClientException("Failed to update token due to an error: " + e.getMessage(), e);
        }


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

    @Getter
    @Setter
    public static class KakaoUserInfo {
        private Long id;
        private String connected_at;
        private  KakaoAccountInfo kakao_account;
    }

    @Getter
    @Setter
    public static class KakaoAccountInfo {
        private Boolean profile_nickname_needs_agreement;
        private Boolean email_needs_agreement;
        private Boolean is_email_valid;
        private Boolean is_email_verified;

        private KakaoProfile kakaoProfile;

        private String email;
    }

    @Getter
    @Setter
    public static class KakaoProfile {
        private Boolean profile_nickname_needs_agreement;
        private String nickname;
    }
}
