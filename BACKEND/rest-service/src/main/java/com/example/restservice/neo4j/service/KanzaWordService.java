package com.example.restservice.neo4j.service;

import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.repository.KanzaWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KanzaWordService {
    private final KanzaWordRepository kanzaWordRepository;
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

}
