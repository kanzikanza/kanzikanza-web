package com.example.restservice.userTest.service;


import com.example.restservice.user.model.UserModel;
import com.example.restservice.userTest.model.UserTestModel;
import com.example.restservice.userTest.repository.UserTestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserTestService {
    private final UserTestRepository userTestRepository;

    public void CreateTest(UserModel userModel)
    {
        userTestRepository.CreateUserTestOnUser(userModel.getUserIndex());
    }

    public List<UserTestModel> findUserTestModelsByUserModel(UserModel userModel)
    {
        return userTestRepository.findUserTestModelsByUserModel(userModel);
    }
}
