package com.example.restservice.security.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class LoginRequest {
    private String email;
    private String password;
}
