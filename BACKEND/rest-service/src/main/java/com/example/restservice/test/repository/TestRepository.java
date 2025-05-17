package com.example.restservice.test.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.test.model.TestModel;

@Repository
public interface TestRepository extends JpaRepository<TestModel, Integer> {
    public TestModel findTestModelByTestLevel(Integer testLevel);
}
