package com.example.restservice.userTest.repository;

import com.example.restservice.test.model.TestModel;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userTest.model.UserTestModel;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTestRepository extends JpaRepository<UserTestModel, Integer> {

        @Transactional
        @Modifying
        @Query(value = "INSERT INTO user_test (user_index, test_index, user_test_progress)" +
                        "SELECT :userId, test_index, 0 FROM test", nativeQuery = true)
        void CreateUserTestOnUser(@Param("userId") Integer userId);

        @Transactional
        @Modifying
        @Query(value = "insert into user_test (user_index, test_index, user_test_progress, user_test_day)" +
                        "SELECT :userId, test_index, 0, 0 from test where test_index > 6", nativeQuery = true)
        void CreateInitialTestModel(@Param("userId") Integer userId);

        List<UserTestModel> findUserTestModelsByUserModel(UserModel userModel);

        public boolean existsByUserModelAndTestModelAndUserTestDay(UserModel userModel, TestModel testModel,
                        Integer testDays);

        public Optional<UserTestModel> findUserTestModelByUserModelAndTestModelAndUserTestDay(UserModel userModel,
                        TestModel testModel, Integer userTestDay);
}
