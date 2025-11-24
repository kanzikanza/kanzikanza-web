package com.example.restservice.neo4j.service;

import java.lang.StackWalker.Option;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Service;

import com.example.restservice.neo4j.dto.KandleInitDataDtos;
import com.example.restservice.neo4j.dto.KandleInitDataDtos.KandleKanza;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KandleRedisService {

    // private final SecurityFilterChain applicationSecurity;
    // KandleRedisService(SecurityFilterChain applicationSecurity) {
    // this.applicationSecurity = applicationSecurity;
    // }

    private final RedisTemplate<String, Object> redisTemplate;

    public long secondsUntilMidnight() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul")); // KST
        LocalDateTime midnight = now.toLocalDate().plusDays(1).atStartOfDay(); // 내일 00:00
        return Duration.between(now, midnight).getSeconds(); // 초 단위
    }

    // TODO DailyKandle 고정값 바꾸기
    public boolean isExistedSession(@NonNull String refreshToken) {
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        if (uuid == null) {
            return false;
        }
        KandleInitDataDtos.KandleSessionResponse response = (KandleInitDataDtos.KandleSessionResponse) redisTemplate
                .opsForHash().get(refreshToken, uuid);
        return response == null;
    }

    public KandleInitDataDtos.KandleSessionResponse getCurrentSession(@NonNull String refreshToken) {
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        if (uuid == null) {
            return null;
        }
        KandleInitDataDtos.KandleSessionResponse response = (KandleInitDataDtos.KandleSessionResponse) redisTemplate
                .opsForHash().get(refreshToken, uuid);
        return response;
    }

    // Boolean 말고 다른거 리턴해야함
    public KandleInitDataDtos.KandleSessionResponse createInitSession(@NonNull String refreshToken) {
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        String answer = getKandleSessionAnswer();
        Integer answerLength = answer.length();
        if (uuid == null) {
            // throw new Exception("No UUId");
            return null;
        }
        // 여기서 아예 같은걸 주자고
        Object obj = redisTemplate.opsForHash().get(refreshToken, uuid);
        if (obj != null) {
            return (KandleInitDataDtos.KandleSessionResponse) obj;
        }

        List<KandleInitDataDtos.KandleKanza> kandleKanzas = (List<KandleInitDataDtos.KandleKanza>) redisTemplate
                .opsForHash()
                .get("DailyKandle", "options");

        KandleInitDataDtos.KandleSessionResponse kandleSessionResponse = KandleInitDataDtos.KandleSessionResponse
                .builder()
                .answerLength(answerLength)
                .uniqueId(uuid)
                .kandleWordKanzas(kandleKanzas)
                .responses(new ArrayList<>())
                .build();
        long left = secondsUntilMidnight();
        if (kandleSessionResponse == null)
            return null;
        redisTemplate.opsForHash().put(refreshToken, uuid, kandleSessionResponse);
        redisTemplate.expire(refreshToken, Duration.ofSeconds(left));
        return kandleSessionResponse;
    }

    public Integer getUserSessionResponsesCount(@NonNull String refreshToken) {
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        if (uuid == null) {
            return null;
        }
        return _getUserSessionResponsesCount(refreshToken, uuid);
    }

    public String getKandleSessionAnswer() {
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        if (uuid == null) {
            return null;
        }
        return _getKandleSessionAnswer(uuid);
    }

    public List<KandleInitDataDtos.KandleKanzaResponse> submitNewResponse(@NonNull String refreshToken,
            String submittedWord) {
        // Hset의 형태를 제대로 살리지 못하는 것 같음,
        String uuid = (String) redisTemplate.opsForHash().get("DailyKandle", "serial");
        if (uuid == null) {
            return null;
        }

        // TODO: Response만을 따로가져올 필요가 있어보임
        String answer = _getKandleSessionAnswer(uuid);
        KandleInitDataDtos.KandleSessionResponse kandleSessionResponse = (KandleInitDataDtos.KandleSessionResponse) redisTemplate
                .opsForHash().get(refreshToken,
                        uuid);

        if (kandleSessionResponse == null)
            return null;

        // "[한자][한자][한자][한자]" 식으로 주어진다

        List<List<KandleInitDataDtos.KandleKanzaResponse>> responses = kandleSessionResponse.getResponses();
        List<KandleInitDataDtos.KandleKanzaResponse> newResponse = new ArrayList<>();

        HashMap<String, Integer> aMap = new HashMap<>();
        for (char c : answer.toCharArray()) {
            Integer cnt = aMap.get(String.valueOf(c)) != null ? aMap.get(String.valueOf(c)) : 0;
            aMap.put(String.valueOf(c), cnt + 1);
        }

        for (int i = 0; i < submittedWord.length(); i++) {
            // 1. i번 문자랑 같다면 맞음 처리한다.
            // log.info(submittedWord + " " + String.valueOf(i));

            if (submittedWord.charAt(i) == answer.charAt(i)) {

                newResponse.add(KandleInitDataDtos.KandleKanzaResponse.builder()
                        .kanza(String.valueOf(submittedWord.charAt(i)))
                        .state(2)
                        .build());
                aMap.put(String.valueOf(answer.charAt(i)), aMap.get(String.valueOf(answer.charAt(i))) - 1);

            } else if (aMap.get(String.valueOf(submittedWord.charAt(i))) != null
                    && aMap.get(String.valueOf(submittedWord.charAt(i))) != 0) {
                newResponse.add(KandleInitDataDtos.KandleKanzaResponse.builder()
                        .kanza(String.valueOf(submittedWord.charAt(i)))
                        .state(1)
                        .build());
                aMap.put(String.valueOf(answer.charAt(i)), aMap.get(String.valueOf(answer.charAt(i))) - 1);
            } else {
                newResponse.add(KandleInitDataDtos.KandleKanzaResponse.builder()
                        .kanza(String.valueOf(submittedWord.charAt(i)))
                        .state(0)
                        .build());
            }

            // 2. i번 문자와 같지 않지만 다른곳에 있다면.
        }
        responses.add(newResponse);
        kandleSessionResponse.setResponses(responses);
        // answer만을 끄내서 확인

        updateKandleUserSession(uuid, refreshToken, kandleSessionResponse);
        return newResponse;
    }

    public boolean createRedisSession(String uuid, KandleInitDataDtos kanzaInitDataDtos) {

        try {
            log.info(uuid);
            if (uuid == null) {
                throw new Exception("No UUID");
            }
            // 새로운 uuid를 받음

            // 저장해야하는 데이터
            // answer =
            // 그걸 저장
            String answer = kanzaInitDataDtos.getKandleWord().getKandleWord();
            log.info(answer);
            if (answer == null) {
                throw new Exception("No Answer");
            }
            // List<String> options = kanzaInitDataDtos.getKandleKanzas().stream().map(x ->
            // x.getKanzaKanza().collect(Collectors.toList());

            // 일단은 이렇게 한번 둬볼게
            redisTemplate.opsForHash().put("DailyKandle", "serial", uuid);
            redisTemplate.opsForHash().put("DailyKandle", "answer", answer);
            redisTemplate.opsForHash().put("DailyKandle", "options", kanzaInitDataDtos.getKandleKanzas());

            // redisTemplate.opsForHash().put(uuid, "answer", answer);
            // redisTemplate.opsForHash().put(uuid, "options",
            // kanzaInitDataDtos.getKandleKanzas());
            // redisTemplate.expire(uuid, Duration.ofSeconds(left));

            long left = secondsUntilMidnight();
            log.info("left" + String.valueOf(left));
            redisTemplate.expire("DailyKandle", Duration.ofSeconds(left));

            return true;
        } catch (Exception e) {
            log.info(e.getMessage());
            return false;
        }
    }

    private String _getKandleSessionAnswer(String uuid) {
        return (String) redisTemplate.opsForHash().get("DailyKandle", "answer");
    }

    private Integer _getUserSessionResponsesCount(@NonNull String refreshToken, @NonNull String uuid) {
        KandleInitDataDtos.KandleSessionResponse arg = (KandleInitDataDtos.KandleSessionResponse) redisTemplate
                .opsForHash().get(refreshToken, uuid);
        if (arg == null)
            return null;
        return arg.getResponses().size();
    }

    // private String getKandleUserSession(String uuid, String refreshToken) {
    // return (String) redisTemplate.opsForHash().get("DailyKandle", "answer");
    // }

    private boolean updateKandleUserSession(
            @NonNull String uuid, @NonNull String refreshToken,
            @NonNull KandleInitDataDtos.KandleSessionResponse response) {
        redisTemplate.opsForHash().put(refreshToken, uuid, response);
        return true;
    }

}
