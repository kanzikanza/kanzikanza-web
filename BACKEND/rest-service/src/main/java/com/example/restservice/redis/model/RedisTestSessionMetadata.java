package com.example.restservice.redis.model;

import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.util.Pair;

import java.util.ArrayList;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@RedisHash("sessionMetadata")
public class RedisTestSessionMetadata {
    @Id
    private String sessionMetadataId;
    private String userId;
    private Integer progress;
    private Integer totalProblem;
    private ArrayList<Integer> wrongNumbers;

    public static RedisTestSessionMetadata createBasicMetadata() {
        return RedisTestSessionMetadata.builder()
                .progress(0)
                .totalProblem(20)
                .build();
    }
}
