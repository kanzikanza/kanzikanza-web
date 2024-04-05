package com.example.restservice.kanzi.persistence;

import com.example.restservice.kanzi.model.Kanza;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface KanzaRepository extends JpaRepository<Kanza, Integer> {

    @Query("select k FROM Kanza k where k.SOUND = ?1")
    List<Kanza> findBySOUND(String SOUND);

    @Query("select k from Kanza k where k.KANZA = ?1")
    Kanza findByKANZA(String KANZA);

    List<Kanza> findTop20ByOrderByIdDesc();

    @Query(value = "select * from kanza order by rand() limit :problemNum ", nativeQuery = true)
    List<Kanza> getKanzasByRandom(@Param("problemNum") Integer problemNum);
}