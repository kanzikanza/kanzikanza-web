package com.example.restservice.dtos;

import lombok.*;
import com.example.restservice.userTest.model.UserTestModel;
import java.util.List;

public class UserTestDtos {

    @Builder
    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestConfigDto {
        private Integer userTestProgress;
        private Integer usetTestDays;
        private Integer testLevel;
    }
}
