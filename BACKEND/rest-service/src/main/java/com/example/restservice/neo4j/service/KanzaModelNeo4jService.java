package com.example.restservice.neo4j.service;


import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.example.restservice.neo4j.repository.KanzaModelNeo4jRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KanzaModelNeo4jService {
    private final KanzaModelNeo4jRepository kanzaModelNeo4jRepository;

    public KanzaModelNeo4j Create(KanzaModelNeo4j kanzaModelNeo4j)
    {
        return kanzaModelNeo4jRepository.save(kanzaModelNeo4j);
    }

    public boolean existsById(String s)
    {
        return kanzaModelNeo4jRepository.existsById(s);
    }

    public boolean existsByKanzaLetter(String s)
    {
        return kanzaModelNeo4jRepository.existsByKanzaLetter(s);
    }

    public KanzaModelNeo4j findKanzaModelNeo4jByKanzaLetter(String kanzaLetter){
        return kanzaModelNeo4jRepository.findKanzaModelNeo4jByKanzaLetter(kanzaLetter);
    }
}
