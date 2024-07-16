package com.example.restservice.userStreak.controller;

import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userStreak.dtos.UserStreakDto;
import com.example.restservice.userStreak.model.UserStreakModel;
import com.example.restservice.userStreak.service.UserStreakService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@RestController
@RequestMapping("streak")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserStreakController {
    private final UserService userService;
    private final UserStreakService userStreakService;
    @GetMapping("/getRecentWeek")
    public ResponseEntity<?> getRecentWeek()
    {
        try {
            UserModel currentUser = userService.findCurrentUser();
            List<UserStreakModel> userStreakModels = userStreakService.findAllWithCreationDateBefore(currentUser);
            UserStreakDto.GetRecentWeekResponse getRecentWeekResponse = UserStreakDto.GetRecentWeekResponse.builder().build();
            getRecentWeekResponse.fillUpDates(userStreakModels);


            Integer onGoingStreak = currentUser.getUserStreakDays();
            if (onGoingStreak != 0)
            {
                getRecentWeekResponse.addToDates(
                        UserStreakDto.StreakDate.builder()
                                .endDay(LocalDate.now())
                                .howLong(onGoingStreak)
                                .build()
                );
            }

            getRecentWeekResponse.setIsExists(getRecentWeekResponse.isDateEmpty());

            return ResponseEntity.ok().body(getRecentWeekResponse);

        } catch (NoSuchElementException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e)
        {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getTodayStreaks")
    public ResponseEntity<?> getTodayStreaks()
    {
        try {
            UserModel currentUser = userService.findCurrentUser();
            return ResponseEntity.ok().body(UserStreakDto.getTodayStreaks.builder()
                            .dates(currentUser.getUserStreakDays())
                    .build());
        }
        catch (NoSuchElementException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
