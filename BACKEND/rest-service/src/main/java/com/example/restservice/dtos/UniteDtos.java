package com.example.restservice.dtos;

import com.example.restservice.userTest.model.UserTestModel;
import lombok.*;

import java.util.List;

public class UniteDtos {



    public class UserTestDtos
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

}
