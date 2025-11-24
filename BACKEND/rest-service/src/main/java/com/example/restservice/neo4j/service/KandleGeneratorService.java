package com.example.restservice.neo4j.service;

import org.springframework.stereotype.Service;

import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import com.example.restservice.neo4j.repository.KanzaModelNeo4jRepository;
import com.example.restservice.neo4j.repository.KanzaWordRepository;

import lombok.extern.slf4j.Slf4j;

import com.example.restservice.neo4j.dto.KandleInitDataDtos;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.stream.Collectors;

@Slf4j
@Service
public class KandleGeneratorService {
    private HashSet<KanzaWord> kanzaWordSet;
    private HashSet<KanzaModelNeo4j> kanzaModelNeo4jSet;
    private Queue<KanzaWord> kanzaWordQueue;
    private Queue<KanzaModelNeo4j> kanzaLetterQueue;

    private KanzaWordRepository kanzaWordRepository;
    private KanzaModelNeo4jRepository kanzaModelNeo4jRepository;
    private KandleRedisService kandleRedisService;

    public KandleGeneratorService(
            KanzaWordRepository kandlWordRepository,
            KanzaModelNeo4jRepository kanzaModelNeo4jRepository,
            KandleRedisService kandleRedisService) {

        log.info("안녕하세요 시작이 됐습니다, 시작입니다");
        log.info("안녕하세요 시작이 됐습니다, 시작입니다");

        this.kanzaWordRepository = kandlWordRepository;
        this.kanzaModelNeo4jRepository = kanzaModelNeo4jRepository;
        this.kandleRedisService = kandleRedisService;

        this.kanzaWordSet = new HashSet<>();
        this.kanzaModelNeo4jSet = new HashSet<>();
        this.kanzaWordQueue = new LinkedList<>();
        this.kanzaLetterQueue = new LinkedList<>();
    }

    public KandleInitDataDtos createKandle(String uuid) {
        // HashSet<KanzaWord> kanzaWordSet;
        // HashSet<KanzaModelNeo4j> kanzaModelNeo4jSet;

        kanzaWordSet.clear();
        kanzaModelNeo4jSet.clear();
        kanzaWordQueue.clear();
        kanzaLetterQueue.clear();

        // 이부분이 시작인거임 랜덤 사자성어를 찾아, 이게 답이라고 저장해놓을거야
        log.info("KANDLE GENERATE 0.5");
        log.info(kanzaModelNeo4jRepository.equals(null) ? "empty" : "non empty");
        log.info(kanzaWordRepository.equals(null) ? "empty" : "non empty");

        KanzaWord kanzaWord = findRandomKandle();
        KandleInitDataDtos.KandleWord answerWord = KandleInitDataDtos.KandleWord.builder()
                .kandleWord(kanzaWord.getWordName())
                .build();
        log.info("KANDLE GENERATE 1");
        // 이 사자성어에 연결된 4개의 한자를 찾았고 이걸 큐에 넣는다
        List<KanzaModelNeo4j> kanzaModelNeo4js = kanzaModelNeo4jRepository.findSazaByLetter(kanzaWord.getWordName());
        List<KandleInitDataDtos.KandleKanza> kandleChoices = new ArrayList<>();
        List<KandleInitDataDtos.KandleKanza> kandleKanzas = kanzaModelNeo4js.stream()
                .map(KandleInitDataDtos.KandleKanza::fromModel).collect(Collectors.toList());

        answerWord.setKandleWordKanzas(kandleKanzas);
        // 현재까지 4개 적립했으며 나머지도 20개까지 다 구할 수 있어짐
        log.info("KANDLE GENERATE 2");

        kandleChoices.addAll(kandleKanzas);
        kanzaLetterQueue.addAll(kanzaModelNeo4js);
        kanzaWordSet.add(kanzaWord);
        while (kandleChoices.size() < 20) {
            round(kandleChoices);
            if (kandleChoices.size() < 20 && kanzaLetterQueue.isEmpty()) {
                kanzaWordQueue.add(findRandomKandle());
            }
        }
        log.info("KANDLE GENERATE 3");

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
        log.info("KANDLE GENERATE 0.6");

        Integer length = kanzaWords.size();
        Integer idx = (int) (Math.random() * length);
        KanzaWord kanzaWord = kanzaWords.get(idx);
        return kanzaWord;
    }

}
