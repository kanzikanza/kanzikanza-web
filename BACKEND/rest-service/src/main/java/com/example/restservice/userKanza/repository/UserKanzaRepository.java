package com.example.restservice.userKanza.repository;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.user.model.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.restservice.userKanza.model.UserKanza;

@Repository
public interface UserKanzaRepository extends JpaRepository<UserKanza, Integer> {
    @Transactional
    @Query(value = "insert into usercustomize (user_id, kanzi_id) \n" +
            "select user_id, kanza_id\n" +
            "from (\n" +
            " select user.id as user_id, kanza.id as kanza_id \n" +
            " from user cross join KANZA\n" +
            " where user.id = :userId\n" +
            " ) as created_view ; ", nativeQuery = true)
    void CreateAllRelationsByUser(long userId);

    UserKanza findUserCustomizeByUserIdAndKanziId(UserModel userModel, KanzaModel kanza);

}
