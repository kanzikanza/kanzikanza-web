package com.example.restservice.neo4j.controller;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.kanza.service.KanziService;
import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import com.example.restservice.neo4j.service.KanzaIncludedService;
import com.example.restservice.neo4j.service.KanzaModelNeo4jService;
import com.example.restservice.neo4j.service.KanzaWordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("neo4j")
@RequiredArgsConstructor
public class Neo4jController {
    private final KanziService kanziService;
    private final KanzaModelNeo4jService kanzaModelNeo4jService;
    private final KanzaWordService kanzaWordService;
    private final KanzaIncludedService kanzaIncludedService;
    @GetMapping("neo4jTest")
    public ResponseEntity<?> neo4jTest()
    {
        try {
            //
            ArrayList<String> kanziArray = new ArrayList<>(Arrays.asList("針", "小", "棒", "大"));
            kanziArray.forEach(x -> {
                KanzaModel kanzaModel = kanziService.findByKANZA(x);
                if (!kanzaModelNeo4jService.existsById(kanzaModel.getKanzaLetter()))
                {
                    kanzaModelNeo4jService.Create(
                            KanzaModelNeo4j.builder()
                                    .kanzaLetter(kanzaModel.getKanzaLetter())
                                    .kanzaSound(kanzaModel.getKanzaSound())
                                    .kanzaMean(kanzaModel.getKanzaMean())
                                    .build()
                    );
                }
            });
        } catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        // 침소봉대 단어를만듬
        try {
            String s = "針小棒大";
            if (!kanzaWordService.existsById(s))
            {
                kanzaWordService.Create(
                        KanzaWord.builder()
                                .wordName(s)
                                .wordKorean("침소봉대")
                                .wordMean("어떤 사람이나 일에 대해 작은 실수를 두고 큰 트집을 잡는 것")
                                .build()
                );
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        try {
            // 일단 주어진 문자열로 시작해서 나중에는 정규식을 써서 이 한자 들어있으면 구하는 방식으로 해봅시다
            String s = "針小棒大";
            KanzaWord kanzaWord = kanzaWordService.findKanzaWordByWordName(s);
            ArrayList<String> kanziArray = new ArrayList<>(Arrays.asList("針", "小", "棒", "大"));
            kanziArray.forEach(x -> {
                KanzaModelNeo4j kanzaModel = kanzaModelNeo4jService.findKanzaModelNeo4jByKanzaLetter(x);
                if (!kanzaIncludedService.existsKanzaIncludedByKanzaWordAndStartId(kanzaWord, x))
                {
                    KanzaIncluded kanzaIncluded = KanzaIncluded.builder()
                            .kanzaWord(kanzaWord)
                            .startId(x)
                            .order(s.indexOf(x))
                            .build();
                    kanzaModel.getKanzaIncludedList().add(kanzaIncluded);
                    kanzaModelNeo4jService.Create(kanzaModel);
                }
            });
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("성공");

    }
}
