package com.example.restservice.security.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {
    private String nickname;
    private Integer profileIndex;
}
