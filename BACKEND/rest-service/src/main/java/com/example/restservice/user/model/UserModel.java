package com.example.restservice.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userIndex;

    private String userEmail;

    @JsonIgnore
    private LocalDateTime userCreatedAt;


    @Column(nullable = true)
    private Integer userStreakDays;
    @Column(nullable = true)
    private String userRefreshToken;
    @Column(nullable = true)
    private Integer userLevel;
    @Column(nullable = true)
    private Integer userStreakfreeze;
    @Column(nullable = true)
    private String userNickname;
    @Column(nullable = true)
    private Integer userProfileChoice;

    @PrePersist
    protected void onCreate()
    {
        if (userCreatedAt == null) {
            userCreatedAt = LocalDateTime.now();
        }
    }
}
