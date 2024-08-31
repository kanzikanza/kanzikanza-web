package com.example.restservice.userStreak.model;

import com.example.restservice.user.model.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "user_streak")
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStreakModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userStreakIndex;

    @JoinColumn(name = "user_index")
    @ManyToOne
    private UserModel userModel;
    private LocalDateTime userStreakCreatedAt;
    private Integer userStreakDays;

    @PrePersist
    protected void onCreate()
    {
        if (userStreakCreatedAt == null) {
            userStreakCreatedAt = LocalDateTime.now();
        }
    }
}
