package com.example.restservice.neo4j.repository;

import com.example.restservice.neo4j.entity.KanzaWord;
import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KanzaIncludedRepository extends Neo4jRepository<KanzaIncluded, Long> {
    KanzaIncluded findKanzaIncludedByKanzaWordAndStartId(KanzaWord kanzaWord, String startId);
    Boolean existsKanzaIncludedByKanzaWordAndStartId(KanzaWord kanzaWord, String startId);
}
