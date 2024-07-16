package com.example.restservice.dtos;

import lombok.*;

import java.util.List;

public class KanzaUniteDtos {
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

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public class KanziDto<T> {
        private String error;
        private List<T> data;
    }

}
