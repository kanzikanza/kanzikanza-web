package com.example.restservice.userStreak.dtos;

import com.example.restservice.userStreak.model.UserStreakModel;
import lombok.*;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStreakDto {

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StreakDate{
        LocalDate endDay;
        Integer howLong;
    }
    @Builder
    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetRecentWeekResponse
    {
        private Boolean isExists;
        private List<StreakDate> dates;

        public void fillUpDates(List<UserStreakModel> userStreakModels)
        {
            if (userStreakModels.isEmpty())
            {
                return;
            }
            userStreakModels.forEach(x -> dates.add(StreakDate.builder()
                    .endDay(x.getUserStreakCreatedAt().toLocalDate().minusDays(1))
                    .howLong(x.getUserStreakDays())
                    .build()));
        }
        public Boolean isDateEmpty()
        {
            return dates.isEmpty();
        }
        public void addToDates(StreakDate date)
        {
            dates.add(date);
        }
    }

    @Builder
    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class getTodayStreaks{
        Integer dates;
    }

}
