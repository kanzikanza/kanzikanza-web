package com.example.restservice.userTest.service;

import com.example.restservice.test.model.TestModel;
import com.example.restservice.test.service.TestService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userTest.model.UserTestModel;
import com.example.restservice.userTest.repository.UserTestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserTestService {
    private final UserTestRepository userTestRepository;
    private final TestService testService;
    private final Integer TESTMAXDAYS = 5;

    public void CreateTest(UserModel userModel) {
        userTestRepository.CreateUserTestOnUser(userModel.getUserIndex());
    }

    public List<UserTestModel> findUserTestModelsByUserModel(UserModel userModel) {
        return userTestRepository.findUserTestModelsByUserModel(userModel);
    }

    public void CreateInitialTestModel(UserModel userModel) {
        userTestRepository.CreateInitialTestModel(userModel.getUserIndex());
    }

    public void updateModel(UserTestModel userTestModel) {
        userTestRepository.save(userTestModel);
    }

    public void CreateTestModelWithDays(UserModel userModel, Integer levels, Integer days) {
        log.info("CreateTestModelWithDays : (userModel, levels, days) (" + userModel.getUserEmail() + ", "
                + levels.toString() + ", " + days.toString() + ")");

        // testModel을 가져온다 levels는 사실상 인덱스와 같다 그러니 여기서 아예 처리해버린다
        if (TESTMAXDAYS == days) {
            if (levels != 1) {
                levels--;
                days = 1;
            }
        } else {
            days++;
        }
        log.info("CreateTestModelWithDays : (userModel, levels, days) (" + userModel.getUserEmail() + ", "
                + levels.toString() + ", " + days.toString() + ")");
        TestModel testModel = testService.findTestModelByTestLevel(levels + 1);

        // 다음 days가 maxDays인지를
        if (userTestRepository.existsByUserModelAndTestModelAndUserTestDay(userModel, testModel, days)) {
            log.info("Already Exists : (userModel, levels, days) (" + userModel.getUserEmail() + ", "
                    + levels.toString() + ", " + Integer.valueOf(days).toString() + ")");
            return;
        }
        UserTestModel userTestModel = UserTestModel.builder()
                .userModel(userModel)
                .testModel(testModel)
                .userTestDay(days)
                .userTestProgress(0)
                .build();

        userTestRepository.save(userTestModel);
        log.info("Create Success : (userModel, levels, days) (" + userModel.getUserEmail() + ", "
                + levels.toString() + ", " + Integer.valueOf(days).toString() + ")");

    }

    public Optional<UserTestModel> findUserTestModelByUserModelAndUserTestModelAndUserTestDays(UserModel userModel,
            Integer levels, Integer days) {
        TestModel testModel = testService.findTestModelByTestLevel(levels + 1);
        log.info(testModel.getTestIndex().toString() + " " + testModel.getTestLevel().toString() + " "
                + Integer.valueOf(days + 1).toString());

        return userTestRepository.findUserTestModelByUserModelAndTestModelAndUserTestDay(userModel,
                testModel, days + 1);
    }

}
