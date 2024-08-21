package com.example.restservice.userKanza.repository;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.user.model.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.restservice.userKanza.model.UserKanza;

@Repository
public interface UserKanzaRepository extends JpaRepository<UserKanza, Integer> {
    @Transactional
    @Modifying()
    @Query(value = "insert into user_kanza (user_index, kanza_index) \n" +
            "select user_id, kanza_id\n" +
            "from (\n" +
            " select user.user_index as user_id, kanza.kanza_index as kanza_id \n" +
            " from user cross join kanza\n" +
            " where user.user_index = :userId\n" +
            " ) as created_view ; ", nativeQuery = true)
    void CreateAllRelationsByUser(Integer userId);

    UserKanza findUserCustomizeByUserIdAndKanziId(UserModel userModel, KanzaModel kanza);

}
