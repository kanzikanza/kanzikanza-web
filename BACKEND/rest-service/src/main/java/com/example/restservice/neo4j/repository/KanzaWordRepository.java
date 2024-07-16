package com.example.restservice.neo4j.repository;

import com.example.restservice.neo4j.entity.KanzaWord;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KanzaWordRepository extends Neo4jRepository<KanzaWord, String> {
    @Override
    boolean existsById(String s);

    KanzaWord findKanzaWordByWordName(String wordName);
}
