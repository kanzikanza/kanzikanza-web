package com.example.restservice.kanza.persistence;

import com.example.restservice.kanza.model.KanzaModel;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface KanzaRepository extends JpaRepository<KanzaModel, Integer> {

    @Query("select k FROM KanzaModel k where k.kanzaSound = ?1")
    List<KanzaModel> findByKanzaSound(String SOUND);

    @Query("select k from KanzaModel k where k.kanzaLetter = ?1")
    KanzaModel findByKanzaLetter(String KANZA);

    KanzaModel findByKanzaIndex(Integer kanzaIndex);

    List<KanzaModel> findTop20ByOrderByKanzaIndexDesc();


    @Query(value = "select * from kanza order by rand() limit :problemNum", nativeQuery = true)
    List<KanzaModel> findKanzasByRandom(@Param("problemNum") Integer problemNum);
}