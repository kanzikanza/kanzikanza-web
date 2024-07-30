package com.example.restservice.redis.service;


import com.example.restservice.kanza.dto.KanzaDto;
import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.kanza.service.KanzaService;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserService userService;
    private final KanzaService kanzaService;
    public void putToCache(String key, String data)
    {
        HashOperations<String, String, Object> values = redisTemplate.opsForHash();
        if (values.get("Node", "head") == null)
        {
            values.put("Node", key, data);
        }
        values.put("Node", key, data);
    }

    public void setValues(String key, String data, Duration duration) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, data, duration);
    }




    public String getValues(String key)
    {
        UserModel userModel =  userService.findCurrentUser();
        String userCode =  userModel.getUserEmail() + "key" + "." + key;
        ValueOperations<String, Object> values = redisTemplate.opsForValue();

        if (values.get(userCode) == null)
        {
            return "key not found";
        }
        return values.get(userCode).toString();
    }

    public KanzaDto cacheKanza(KanzaModel kanzaModel)
    {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        KanzaDto kanzaDto = KanzaDto.builder()
                .KANZA(kanzaModel.getKanzaLetter())
                .MEAN(kanzaModel.getKanzaMean())
                .SOUND(kanzaModel.getKanzaSound())
                .build();

        Duration duration = Duration.ofSeconds(1000);
        values.set("Kanza::" + kanzaModel.getKanzaIndex().toString(), kanzaDto, duration);
        return kanzaDto;
    }

    public Optional<KanzaDto> getCacheKanza(Integer kanzaIndex) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        if (values.get("Kanza::" + kanzaIndex.toString()) == null) {
            return Optional.empty();
        }
        KanzaDto kanzaDto = (KanzaDto) values.get("Kanza::" + kanzaIndex);
        return Optional.of(kanzaDto);
    }

    // LinkedList를 만드는 코드
    public void checkLinkedList(String userIndex)
    {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
//        redisTemplate.delete(userIndex + "::LinkedList");
        Duration duration = Duration.ofSeconds(1000);
        if (values.get(userIndex + "::LinkedList") == null)
        {
            values.set(userIndex + "::LinkedList", "1", duration);
            values.set(userIndex + "::LinkedList::Cache::Head", "-1", duration);
            values.set(userIndex + "::LinkedList::Cache::Tail", "-3", duration);
//            values.set(userIndex + "::LinkedList::Cache::Head" + "::next", "Null");
//            values.set(userIndex + "::LinkedList::Cache::Tail" + "::next", "Null");
//            values.set(userIndex + "::LinkedList::Cache::Tail" + "::before", "Null");
//            values.set(userIndex + "::LinkedList::Cache::Head" + "::before", "Null");
            values.set(userIndex + "::LinkedList::Cache" + "::meta::MaxLength", "5", duration);
            values.set(userIndex + "::LinkedList::Cache" + "::meta::Length", "0", duration);

            String linkedList = userIndex + "::LinkedList::Cache";
            values.set(linkedList + "::Head" + "::Next", linkedList + "::Tail", duration);
            values.set(linkedList + "::Tail" + "::Before", linkedList + "Head", duration);
        }
    }

    public Integer getCachedNumber(String userIndex) throws NullPointerException
    {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        try
        {
            return Integer.valueOf(values.get(userIndex + "::LinkedList::Cache" + "::meta::Length").toString());
        } catch (NullPointerException e)
        {
            throw e;
        }
    }

    public String getNextNode(String nodeName)
    {
        return "이스터에그다 시발아";
    }
    public void make2Node(String userIndex)
    {

        ValueOperations<String, Object> values = redisTemplate.opsForValue();

        // 원래는 노드의 인덱스를 LinkedList와 연동해야하지만 일단 하지않음
        // Integer index = (Integer) values.get(userIndex.toString() + "::LinkedList::Cache::Meta::Length");

        // 한자의 노드를 가져와야함.
        // 캐시의 인덱스는 의미가 없음
        Duration duration = Duration.ofSeconds(1000);

        Integer index = 1;
        String Node1 = userIndex + "::LinkedList::Node::" + index.toString();
        values.set(Node1, "시발", duration);
        values.set(Node1 + "::Next", "Null", duration);
        values.set(Node1 + "::Before", "Null", duration);
        String Node2 = userIndex + "::LinkedList::Node::" + ((Integer) (index + 1)).toString();
        values.set(Node2, "섹스", duration);
        values.set(Node2 + "::Next", "Null", duration);
        values.set(Node2 + "::Before", "Null", duration);

        // 두 노드를 연결M
        values.set(Node1 + "::Next", ((Integer) (index + 1)).toString(), duration);
        values.set(Node2 + "::Before", index.toString(), duration);
    }




    public void redisCacheDelete(String nodeKey)
    {
        Duration duration = Duration.ofSeconds(100);

        redisTemplate.execute((RedisCallback<? extends Object>) connection -> {
            ValueOperations<String, Object> values = redisTemplate.opsForValue();

            String leftNodeKey = values.get(nodeKey + "::Next").toString();
            String rightNodeKey = values.get(nodeKey + "::Before").toString();

            values.set(rightNodeKey + "::Before", leftNodeKey, duration);
            values.set(leftNodeKey + "::Next", rightNodeKey, duration);
            redisTemplate.delete(nodeKey);
            return null;
        });
    }
    public void redisCachePutHead(String headKey, String nodeKey, KanzaDto kanzaDto)
    {
        Duration duration = Duration.ofSeconds(100);
        redisTemplate.execute((RedisCallback<? extends Object>) connection -> {
            ValueOperations<String, Object> values = redisTemplate.opsForValue();
            String rightNodeKey = values.get(headKey + "::Next").toString();
            log.info(headKey + " Head에서 한칸 밀려날 놈은 " + rightNodeKey);
            values.set(rightNodeKey + "::Before", nodeKey, duration);
            values.set(headKey + "::Next", nodeKey, duration);
            values.set(nodeKey, kanzaDto, duration);
            values.set(nodeKey + "::Before", headKey, duration);
            values.set(nodeKey + "::Next", rightNodeKey, duration);
            return null;
        });
    }

    public void redisCachePut(String userIndex, String kanzaIndex)
    {
        Duration duration = Duration.ofSeconds(100);
        redisTemplate.execute((RedisCallback<? extends Object>) connection -> {
            ValueOperations<String, Object> values = redisTemplate.opsForValue();
            // 연결리스트 없으면 만드는 코드


            checkLinkedList(userIndex);

            String linkedList = userIndex + "::LinkedList";
            String possibleNodeKey = linkedList + "::Node::" + kanzaIndex;

            // 놔란줄 하나부터 확인
            Integer size = Integer.valueOf(values.get(linkedList + "::Cache" + "::meta::Length").toString());
            log.info("기존의 사이즈는 " + size.toString());
            if (values.get(possibleNodeKey) != null) {
                log.info("캐시안에 있는 노드를 다시 푸시할 떄는 옮긴다.");
                redisCacheDelete(possibleNodeKey);
                size--;
            } else {
                if (size + 1 == Integer.valueOf(values.get(linkedList + "::Cache" + "::meta::MaxLength").toString())) {
                    log.info("최대 길이에 도달해 tail의 노드를 지운다");
                    String popNode = values.get(linkedList + "::Cache" + "::Tail::Before").toString();
                    redisCacheDelete(popNode);
                    size--;
                }
            }
             log.info("2");
            KanzaModel kanzaModel = kanzaService.findByKanzaIndex(Integer.valueOf(kanzaIndex));

            KanzaDto kanzaDto = KanzaDto.builder()
                    .KANZA(kanzaModel.getKanzaLetter())
                    .SOUND(kanzaModel.getKanzaSound())
                    .MEAN(kanzaModel.getKanzaMean())
                    .build();
             log.info("3");

            redisCachePutHead(linkedList + "::Cache" + "::Head", possibleNodeKey, kanzaDto);
            size++;
            log.info("이후의 사이즈는 "  + size.toString());
            values.set(linkedList + "::Cache" + "::meta::Length", size, duration);
            return null;
        });
    }
}
