package com.example.restservice.kanza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class InpDto {

    @Getter
    @Setter
    @AllArgsConstructor
    public class isRight{
        private String kanza;
        private boolean isWin;
    }
}
