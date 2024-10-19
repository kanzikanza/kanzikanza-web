package com.example.restservice.neo4j.service;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.kanza.service.KanzaService;
import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import com.example.restservice.neo4j.repository.KanzaWordRepository;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

@Service
@Slf4j
@RequiredArgsConstructor
public class KanzaWordService {
    private final KanzaWordRepository kanzaWordRepository;
    private final KanzaModelNeo4jService kanzaModelNeo4jService;
    private final KanzaIncludedService kanzaIncludedService;
    private final KanzaService kanzaService;
    public void Create(KanzaWord kanzaWord)
    {
        kanzaWordRepository.save(kanzaWord);
    }

    public boolean existsById(String s)
    {
        return kanzaWordRepository.existsById(s);
    }
    public KanzaWord findKanzaWordByWordName(String wordName)
    {
        return  kanzaWordRepository.findKanzaWordByWordName(wordName);
    }


    public void AddNewIdiom(JsonObject word)
    {
        String idiomKanza = word.get("kanza").getAsString();
        String idiomMean = word.get("mean").getAsString();
        String idiomSound = word.get("sound").toString();
        Integer idiomIndex = word.get("index").getAsInt();
//        log.info(idiomKanza, idiomMean, idiomSound);
        if (idiomMean.isEmpty())
        {
            return ;
        }
        ArrayList<KanzaModel> kanziArray = new ArrayList<>();
        KanzaWord idiom = KanzaWord.builder()
                        .wordName(idiomKanza)
                        .wordKorean(idiomSound)
                        .wordMean(idiomMean)
                        .build();
        for (int i = 0; i < idiomKanza.length(); i++)
        {
            if (idiomKanza.charAt(i) == ' ')
            {
                continue;
            }
            String letterKanza = idiomKanza.substring(i, i + 1);
            KanzaModel kanzaModel = kanzaService.findByKANZA(letterKanza);
            if (kanzaModel == null) {
                log.info("단어를 완성할 수 없음 이유 : " + letterKanza + " " + idiomKanza);
                return;
            }
            kanziArray.add(kanzaModel);
        }

        Create(idiom);
        kanziArray.forEach(kanzaModel->{
            KanzaModelNeo4j kanzaModelNeo4j;
            KanzaIncluded kanzaIncluded;
            if (!kanzaModelNeo4jService.existsByKanzaLetter(kanzaModel.getKanzaLetter()))
            {
                kanzaModelNeo4j = kanzaModelNeo4jService.Create(
                        KanzaModelNeo4j.builder()
                                .kanzaLetter(kanzaModel.getKanzaLetter())
                                .kanzaSound(kanzaModel.getKanzaSound())
                                .kanzaMean(kanzaModel.getKanzaMean())
                                .kanzaIncludedList(new HashSet<>())
                                .build());
            }
            else
            {
                kanzaModelNeo4j = kanzaModelNeo4jService.findKanzaModelNeo4jByKanzaLetter(kanzaModel.getKanzaLetter());
            }
            if (!kanzaIncludedService.existsKanzaIncludedByKanzaWordAndStartId(idiom, kanzaModel.getKanzaLetter()))
            {
                kanzaIncluded = KanzaIncluded.builder()
                        .kanzaWord(idiom)
                        .startId(kanzaModel.getKanzaLetter())
                        .order(idiomKanza.indexOf(kanzaModel.getKanzaLetter()))
                        .build();
            }
            else
            {
                kanzaIncluded = kanzaIncludedService.findKanzaIncludedByKanzaWordAndStartId(idiom, kanzaModel.getKanzaLetter());
            }
            kanzaModelNeo4j.getKanzaIncludedList().add(kanzaIncluded);
            kanzaModelNeo4jService.Create(kanzaModelNeo4j);
        });
        log.info("단어를 완성", idiom.getWordName() + " " + idiom.getWordKorean());
    }
}
