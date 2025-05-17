package com.example.restservice.test.service;

import org.springframework.stereotype.Service;

import com.example.restservice.test.model.TestModel;
import com.example.restservice.test.repository.TestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TestService {
    private final TestRepository testRepository;

    public TestModel findTestModelByTestLevel(Integer testLevel) {
        return testRepository.findTestModelByTestLevel(testLevel);
    };
}
