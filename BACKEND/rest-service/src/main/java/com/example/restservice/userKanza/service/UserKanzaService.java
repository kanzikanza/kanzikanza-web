package com.example.restservice.userKanza.service;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.model.UserKanza;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import com.example.restservice.userKanza.repository.UserKanzaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserKanzaService {
    private final UserKanzaRepository userCustomizeRepository;

    public void updateOnSignUp(UserModel userModel) {
        userCustomizeRepository.CreateAllRelationsByUser(userModel.getUserIndex());
    }

    public void updateParameter(UserModel userModel, KanzaModel kanza, Boolean isWin) {
        UserKanza userCustomize = findOrCreate(userModel, kanza);
        if (isWin) {
            userCustomize.setUserKanzaScore(userCustomize.getUserKanzaScore() + 1);
        } else {
            userCustomize.setUserKanzaScore(userCustomize.getUserKanzaScore() - 1);
        }
        userCustomizeRepository.save(userCustomize);
    }

    public ArrayList<UserKanza> getUserReviewData(UserModel userModel, int limit) {
        return userCustomizeRepository.findReviewProblem(userModel, limit);
    }

    public UserKanza findOrCreate(UserModel userModel, KanzaModel kanza) {
        return userCustomizeRepository.findByUserIndexAndKanzaIndex(userModel, kanza).orElse(
                UserKanza.builder()
                        .userIndex(userModel)
                        .kanzaIndex(kanza)
                        .userKanzaScore(0)
                        .build());
    }

}
