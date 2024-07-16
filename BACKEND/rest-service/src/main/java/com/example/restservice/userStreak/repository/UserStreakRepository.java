package com.example.restservice.userStreak.repository;

import com.example.restservice.user.model.UserModel;
import com.example.restservice.userStreak.model.UserStreakModel;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreakModel, Integer>
{
    @Query("SELECT u FROM UserStreakModel u WHERE u.userStreakCreatedAt >= :date and u.userModel = :user ")
    List<UserStreakModel> findAllWithCreationDateBefore(@Param("date") LocalDateTime date, @Param("user") UserModel userModel);
}
