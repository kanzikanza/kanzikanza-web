package com.example.restservice.redis.service;


import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserService userService;
    public void putToCache(String key, String data)
    {
        HashOperations<String, String, Object> values = redisTemplate.opsForHash();
        if (values.get("Node", "head") == null)
        {
            values.put("Node", key, data);
        }
        values.put("Node", key, data);
    }

    public String getValues(String key)
    {
        UserModel userModel =  userService.findCurrentUser();
        String userCode =  userModel.getEmail() + "key" + "." + key;
        ValueOperations<String, Object> values = redisTemplate.opsForValue();

        if (values.get(userCode) == null)
        {
            return "key not found";
        }

        return values.get(userCode).toString();
    }
}
