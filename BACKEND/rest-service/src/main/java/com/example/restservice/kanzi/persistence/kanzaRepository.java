package com.example.restservice.kanzi.persistence;

import com.example.restservice.kanzi.model.kanza;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface kanzaRepository extends JpaRepository<kanza, Integer> {

}