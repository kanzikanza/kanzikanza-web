package com.example.restservice.security.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginReqponse {
    private final String accessToken;

}
