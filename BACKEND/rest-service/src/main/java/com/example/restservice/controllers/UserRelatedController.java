package com.example.restservice.controllers;

import com.example.restservice.dtos.UserUniteDtos;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.service.UserKanzaService;
import com.example.restservice.userTest.model.UserTestModel;
import com.example.restservice.userTest.service.UserTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.NoSuchElementException;


@RequiredArgsConstructor
public class UserRelatedController {
    private final UserTestService userTestService;
    private final UserService userService;
    private final UserKanzaService userKanzaService;
    @RestController
    @RequestMapping("api/userTest")
    public class UserTestController {

        @GetMapping("/getTest")
        ResponseEntity<?> getTest()
        {
            try {
                UserModel userModel = userService.findCurrentUser();
                List<UserTestModel> userTestModels = userTestService.findUserTestModelsByUserModel(userModel);

                UserUniteDtos.UserTestDtos.UserTestDto userTestDto =  UserUniteDtos.UserTestDtos.UserTestDto.builder().build();
                userTestModels.forEach(x -> userTestDto.testLevels.add(UserUniteDtos.UserTestDtos.toTestLevelDto(x)));

                return ResponseEntity.status(HttpStatus.OK).body(userTestDto);

            } catch (NoSuchElementException e)
            {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없음");
            } catch (Exception e)
            {
                return ResponseEntity.badRequest().body("확인할 수 없는 에러");
            }

        }
    }

}
