package com.example.restservice.neo4j.component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.restservice.neo4j.dto.KandleInitDataDtos;
import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import com.example.restservice.neo4j.repository.KanzaModelNeo4jRepository;
import com.example.restservice.neo4j.repository.KanzaWordRepository;
import com.example.restservice.neo4j.service.KandleRedisService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class KandleComponent {

    private HashSet<KanzaWord> kanzaWordSet;
    private HashSet<KanzaModelNeo4j> kanzaModelNeo4jSet;
    private Queue<KanzaWord> kanzaWordQueue;
    private Queue<KanzaModelNeo4j> kanzaLetterQueue;

    private final KanzaWordRepository kanzaWordRepository;
    private final KanzaModelNeo4jRepository kanzaModelNeo4jRepository;
    private final KandleRedisService kandleRedisService;

    /*
     * 1 2 3 4 5 6 // 순서
     * * * * * * // 실행주기 문자열
     * 
     * // 순서별 정리
     * 1. 초(0-59)
     * 2. 분(0-59)
     * 3. 시간(0-23)
     * 4. 일(1-31)
     * 5. 월(1-12)
     * 6. 요일(0-7)
     */
    public KandleComponent(
            KanzaWordRepository kandlWordRepository,
            KanzaModelNeo4jRepository kanzaModelNeo4jRepository,
            KandleRedisService kandleRedisService) {
        this.kanzaWordRepository = kandlWordRepository;
        this.kanzaModelNeo4jRepository = kanzaModelNeo4jRepository;
        this.kandleRedisService = kandleRedisService;

        this.kanzaWordSet = new HashSet<>();
        this.kanzaModelNeo4jSet = new HashSet<>();
        this.kanzaWordQueue = new LinkedList<>();
        this.kanzaLetterQueue = new LinkedList<>();
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public KandleInitDataDtos createKandle() {
        // HashSet<KanzaWord> kanzaWordSet;
        // HashSet<KanzaModelNeo4j> kanzaModelNeo4jSet;
        String uuid = UUID.randomUUID().toString();
        kanzaWordSet.clear();
        kanzaModelNeo4jSet.clear();
        kanzaWordQueue.clear();
        kanzaLetterQueue.clear();

        // 이부분이 시작인거임 랜덤 사자성어를 찾아, 이게 답이라고 저장해놓을거야
        KanzaWord kanzaWord = findRandomKandle();
        KandleInitDataDtos.KandleWord answerWord = KandleInitDataDtos.KandleWord.builder()
                .kandleWord(kanzaWord.getWordName())
                .build();

        // 이 사자성어에 연결된 4개의 한자를 찾았고 이걸 큐에 넣는다
        List<KanzaModelNeo4j> kanzaModelNeo4js = kanzaModelNeo4jRepository.findSazaByLetter(kanzaWord.getWordName());
        List<KandleInitDataDtos.KandleKanza> kandleChoices = new ArrayList<>();
        List<KandleInitDataDtos.KandleKanza> kandleKanzas = kanzaModelNeo4js.stream()
                .map(KandleInitDataDtos.KandleKanza::fromModel).collect(Collectors.toList());

        answerWord.setKandleWordKanzas(kandleKanzas);
        // 현재까지 4개 적립했으며 나머지도 20개까지 다 구할 수 있어짐

        kandleChoices.addAll(kandleKanzas);
        kanzaLetterQueue.addAll(kanzaModelNeo4js);
        kanzaWordSet.add(kanzaWord);
        while (kandleChoices.size() < 20) {
            round(kandleChoices);
            if (kandleChoices.size() < 20 && kanzaLetterQueue.isEmpty()) {
                kanzaWordQueue.add(findRandomKandle());
            }
        }

        KandleInitDataDtos response = KandleInitDataDtos.builder()
                .kandleWord(answerWord)
                .kandleKanzas(kandleChoices)
                .build();
        kandleRedisService.createRedisSession(uuid, response);
        // 스케줄러로써 레디스나 persistance 에 저장해놓아야함
        return response;
    }

    private void round(List<KandleInitDataDtos.KandleKanza> kandleChoices) {
        while (!kanzaLetterQueue.isEmpty()) {
            KanzaModelNeo4j kanzaModelNeo4j = kanzaLetterQueue.poll();
            List<KanzaWord> words = kanzaModelNeo4j.getKanzaIncludedList().stream().map(
                    KanzaIncluded::toWord).collect(Collectors.toList());
            for (KanzaWord kanzaWord : words) {
                if (kanzaWordSet.contains(kanzaWord)) {
                    continue;
                }
                kanzaWordSet.add(kanzaWord);
                kanzaWordQueue.add(kanzaWord);
            }
        }

        while (!kanzaWordQueue.isEmpty()) {
            KanzaWord kanzaWord = kanzaWordQueue.poll();
            List<KanzaModelNeo4j> kanzaModelNeo4js = kanzaModelNeo4jRepository
                    .findSazaByLetter(kanzaWord.getWordName());

            // System.out.println(kanzaModelNeo4js.stream().map((x) -> {
            // return x.getKanzaLetter();
            // }).collect(Collectors.toList()));

            for (KanzaModelNeo4j kanzaModelNeo4j : kanzaModelNeo4js) {
                if (kanzaModelNeo4jSet.contains(kanzaModelNeo4j))
                    continue;
                if (kandleChoices.size() < 20) {
                    kanzaModelNeo4jSet.add(kanzaModelNeo4j);
                    kanzaLetterQueue.add(kanzaModelNeo4j);
                    kandleChoices.add(KandleInitDataDtos.KandleKanza.fromModel(kanzaModelNeo4j));
                }
            }
        }
    }

    private KanzaWord findRandomKandle() {
        List<KanzaWord> kanzaWords = kanzaWordRepository.findAll();
        Integer length = kanzaWords.size();
        Integer idx = (int) (Math.random() * length);
        KanzaWord kanzaWord = kanzaWords.get(idx);
        return kanzaWord;
    }

}
