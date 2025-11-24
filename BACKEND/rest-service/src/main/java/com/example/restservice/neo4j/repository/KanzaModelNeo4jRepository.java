package com.example.restservice.neo4j.repository;

import com.example.restservice.neo4j.entity.KanzaModelNeo4j;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KanzaModelNeo4jRepository extends Neo4jRepository<KanzaModelNeo4j, String> {

    @Override
    boolean existsById(String s);

    boolean existsByKanzaLetter(String s);

    KanzaModelNeo4j findKanzaModelNeo4jByKanzaLetter(String kanzaLetter);

    @Query("""
                MATCH (us:KanzaModelNeo4j)-[r:Included]->(saza:KanzaWord)
                WHERE saza.wordName = $wordName
                RETURN us
            """)
    List<KanzaModelNeo4j> findSazaByLetter(@Param("wordName") String wordName);

}
