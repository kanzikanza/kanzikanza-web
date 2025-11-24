package com.example.restservice.neo4j.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.restservice.neo4j.component.KandleComponent;
import com.example.restservice.neo4j.repository.KanzaModelNeo4jRepository;
import com.example.restservice.neo4j.repository.KanzaWordRepository;
import com.example.restservice.neo4j.service.KandleGeneratorService;
import com.example.restservice.neo4j.service.KandleRedisService;

@Configuration
public class KandleConfig {
    @Bean
    public KandleComponent KandleComponent(
            KanzaWordRepository kandlWordRepository,
            KanzaModelNeo4jRepository kanzaModelNeo4jRepository,
            KandleRedisService kandleRedisService) {
        return new KandleComponent(kandlWordRepository, kanzaModelNeo4jRepository, kandleRedisService);
    }

    @Bean
    public KandleGeneratorService kandleGeneratorService(
            KanzaWordRepository kanzaWordRepository,
            KanzaModelNeo4jRepository kanzaModelNeo4jRepository,
            KandleRedisService kandleRedisService) {
        return new KandleGeneratorService(kanzaWordRepository, kanzaModelNeo4jRepository, kandleRedisService);
    }
}
