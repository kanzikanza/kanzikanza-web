package com.example.restservice.redis.model;

import org.springframework.data.redis.core.RedisHash;

import com.example.restservice.dtos.KanzaUniteDtos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("session")
public class RedisTestSession {
    @Id
    private String sessionId;
    @OneToOne
    @JoinColumn(name = "sessionMetadataId")
    private RedisTestSessionMetadata redisTestSessionMetadata;

    // @Column(name = "testProblems")
    private String testProblemsJson;
}
