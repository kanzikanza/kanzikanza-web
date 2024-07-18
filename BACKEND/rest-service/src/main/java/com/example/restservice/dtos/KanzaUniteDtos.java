package com.example.restservice.dtos;

import lombok.*;

import java.util.List;

public class KanzaUniteDtos {
    @Getter
    @Builder
    public static class InpDto {
        @Getter
        @Setter
        @AllArgsConstructor
        public static class isRight{
            private String kanza;
            private boolean isWin;
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class KanziDto<T> {
        private String error;
        private List<T> data;
    }


    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Setter
    @Getter
    @Data
    public static class Problem{
        private Integer problemType;
        private Integer isFromCache;
        private List<String> options;
        private Integer level;
        private Integer answer;
        private Integer problemIndex;
        private String problemContent;
    }


    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class TestProblems
    {
        private Integer length;
        private Integer testLevel;
        private Integer days;
        private List<Problem> problems;
    }
}
