package com.example.restservice.test.controller;

import com.example.restservice.redis.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("test")
@RequiredArgsConstructor
public class Testcontroller {
    private final RedisService redisService;

    @GetMapping("/make2Nodes")
    public ResponseEntity<?> make2Node(@RequestParam(required = true) String userIndex)
    {
        try
        {
            redisService.checkLinkedList(userIndex);
            redisService.make2Node(userIndex);
            return ResponseEntity.ok(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/redisGetUserCache")
    public ResponseEntity<?> redisGetUserCache(@RequestParam(required = true) String userIndex, String kanzaIndex ) {

        try
        {
            log.info("시작지점에 진입");
            redisService.redisCachePut(userIndex, kanzaIndex);
            redisService.redisCachePut(userIndex, String.valueOf(7057));
            return ResponseEntity.ok(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
