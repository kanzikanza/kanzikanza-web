package com.example.restservice.kanzi.persistence;

import com.example.restservice.kanzi.model.kanza;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Random;

@Repository
public interface kanzaRepository extends JpaRepository<kanza, Integer> {

    @Query("select k FROM kanza k where k.SOUND = ?1")
    List<kanza> findBySOUND(String SOUND);

    @Query("select k from kanza k where k.KANZA = ?1")
    List<kanza> findByKANZA(String KANZA);

    List<kanza> findTop20ByOrderByIdDesc();

    @Query(value = "select * from kanza ORDER BY RAND() limit 20" , nativeQuery = true)
    List<kanza> findRandom20();
}