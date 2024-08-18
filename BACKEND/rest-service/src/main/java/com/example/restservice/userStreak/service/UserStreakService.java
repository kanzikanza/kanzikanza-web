package com.example.restservice.userStreak.service;

import com.example.restservice.user.model.UserModel;
import com.example.restservice.userStreak.model.UserStreakModel;
import com.example.restservice.userStreak.repository.UserStreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserStreakService {
    private final UserStreakRepository userStreakRepository;
    public List<UserStreakModel> findAllWithCreationDateBefore(UserModel userModel)
    {
        LocalDate localDate = LocalDate.now();
        LocalDateTime localDateTime = localDate.atStartOfDay().minusDays(6);
        // 생성 된 이유는 그날 못했기 때문

        return userStreakRepository.findAllWithCreationDateBefore(localDateTime, userModel);

    }
}
