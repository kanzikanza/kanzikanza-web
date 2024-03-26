package com.example.restservice.usercustomize.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.restservice.usercustomize.model.usercustomizeModel;



public interface usercustomizeRepository extends JpaRepository<usercustomizeModel, Long>{
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO usercustomize (user_id, kanza_id) " +
                   "SELECT derived_table.id, derived_table.kanza_id " +
                   "FROM ( " +
                   "    SELECT user.id AS id, kanza.id AS kanza_id " +
                   "    FROM user " +
                   "    CROSS JOIN kanza " +
                   "    WHERE user.id = :userId " +
                   ") AS derived_table", nativeQuery = true)
    void insertUserCustomize(@Param("userId") Long userId);
}
