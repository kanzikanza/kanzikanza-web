package com.example.restservice.security.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
public class ProfileRequest {
    private String nickname;
    private Integer profileIndex;
}
