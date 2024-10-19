package com.example.restservice.neo4j.repository;

import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KanzaModelNeo4jRepository extends Neo4jRepository<KanzaModelNeo4j, String> {

    @Override
    boolean existsById(String s);


    boolean existsByKanzaLetter(String s);
    KanzaModelNeo4j findKanzaModelNeo4jByKanzaLetter(String kanzaLetter);
}
