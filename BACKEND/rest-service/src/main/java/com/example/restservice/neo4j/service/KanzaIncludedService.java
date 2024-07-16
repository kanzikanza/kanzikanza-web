package com.example.restservice.neo4j.service;


import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import com.example.restservice.neo4j.repository.KanzaIncludedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KanzaIncludedService {
    private final KanzaIncludedRepository kanzaIncludedRepository;

    public KanzaIncluded findKanzaIncludedByKanzaWordAndStartId(KanzaWord kanzaWord, String startId)
    {
        return  kanzaIncludedRepository.findKanzaIncludedByKanzaWordAndStartId(kanzaWord, startId);
    }

    public Boolean existsKanzaIncludedByKanzaWordAndStartId(KanzaWord kanzaWord, String startId)
    {
        return kanzaIncludedRepository.existsKanzaIncludedByKanzaWordAndStartId(kanzaWord, startId);
    }
}
