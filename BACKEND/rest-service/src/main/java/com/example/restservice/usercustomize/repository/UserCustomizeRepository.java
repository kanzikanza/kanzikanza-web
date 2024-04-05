package com.example.restservice.usercustomize.repository;

import com.example.restservice.kanzi.model.Kanza;
import com.example.restservice.user.model.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.restservice.usercustomize.model.UserCustomize;

@Repository
public interface UserCustomizeRepository extends JpaRepository<UserCustomize, Integer> {
    @Transactional
    @Query(value = "insert into usercustomize (user_id, kanzi_id) \n" +
            "select user_id, kanza_id\n" +
            "from (\n" +
            " select user.id as user_id, kanza.id as kanza_id \n" +
            " from user cross join KANZA\n" +
            " where user.id = :userId\n" +
            " ) as created_view ; ", nativeQuery = true)
    void CreateAllRelationsByUser(long userId);

    UserCustomize findUserCustomizeByUserIdAndKanziId(UserModel userModel, Kanza kanza);

}
