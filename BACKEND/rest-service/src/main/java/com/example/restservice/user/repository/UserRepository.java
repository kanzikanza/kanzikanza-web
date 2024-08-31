package com.example.restservice.user.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.restservice.user.model.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    UserModel findByUserEmail(String email);

    UserModel findUserModelByUserKakaoSerial(Long id);

    boolean existsByUserEmail(String email);
}
