package com.example.restservice.dtos;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class KanzaUniteDtos {
    @Getter
    @Builder
    public static class InpDto {
        @Getter
        @Setter
        @AllArgsConstructor
        public static class isRight {
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
    @Data
    public static class ResposneGetSessionExisted {
        private String userId;
        private boolean isSessionExisted;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Setter
    @Getter
    @Data
    public static class Problem {
        private Integer problemType;
        private Integer isFromCache;
        private List<String> options;
        private Integer level;
        private Integer answer;
        private Integer problemIndex;
        private Integer kanzaIndex;
        private String kanzaMean;
        private String kanzaSound;
        private String kanzaLetter;
        private String problemContent;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class ProblemLog {
        private Integer problemType;
        private Integer isFromCache;
        private Integer level;
        private Integer kanzaIndex;
        private Integer isRight;
        private Integer problemIndex;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class LogApi {
        private Integer length;
        private Integer testLevel;
        private ProblemLog problem;
    }

    // Todo: 향후 정확한 세션을 위해서 ID나 해시아이디 추가
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class TestProblems {
        private Integer length;
        private Integer testLevel;
        private Integer days;
        private List<Problem> problems;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class TestMetaData {
        private Integer progress;
        private Integer totalProblem;
        private ArrayList<Integer> wrongNumbers;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class TestResultData {
        private TestMetaData testMetaData;
        private Integer userStreak;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    public static class KanzaIdiom {
        private String kanza;
        private String sound;
        private String mean;
        private Integer index;
    }
}
