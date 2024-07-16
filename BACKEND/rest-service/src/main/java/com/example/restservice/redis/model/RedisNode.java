package com.example.restservice.redis.model;

import com.example.restservice.kanza.dto.KanzaDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

@Entity
@Getter
@Setter
@RedisHash("Node")
@AllArgsConstructor
@NoArgsConstructor
public class RedisNode {
    @Id
    private String NodeId;
    private Integer UserId;
    private String value;
    private String next;
    private String before;
}
