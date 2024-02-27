package com.example.restservice.config.kakao;

import org.springframework.boot.json.JsonParser;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

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
}
