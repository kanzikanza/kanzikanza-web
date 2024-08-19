package com.example.restservice.dtos;

import com.example.restservice.userTest.model.UserTestModel;
import lombok.*;

import java.util.List;

public class UserUniteDtos {




    public static class UserTestDtos
    {
        @Builder
        @Setter
        @Getter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class UserTestDto
        {
            public List<TestLevelDto> testLevels;
        }

        @Builder
        @Setter
        @Getter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TestLevelDto{
            private Integer testLevel;
            private Integer daysDone;
            private Integer daysLimit;
        }
        public static TestLevelDto toTestLevelDto(UserTestModel userTestModel)
        {
            return TestLevelDto.builder()
                    .testLevel(userTestModel.getTestModel().getTestLevel())
                    .daysLimit(userTestModel.getTestModel().getTestMaxDays())
                    .daysDone(userTestModel.getUserTestProgress())
                    .build();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String refreshToken;
    }


}
