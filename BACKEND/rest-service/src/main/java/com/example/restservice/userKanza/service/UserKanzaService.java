package com.example.restservice.userKanza.service;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.model.UserKanza;
import org.springframework.stereotype.Service;
import com.example.restservice.userKanza.repository.UserKanzaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserKanzaService {
    private final UserKanzaRepository userCustomizeRepository;
    private final UserService userService;
    public void updateOnSignUp(UserModel userModel){
        userCustomizeRepository.CreateAllRelationsByUser(userModel.getUserIndex());
    }

    public void updateParameter(KanzaModel kanza, Boolean isWin) {
        UserModel userModel = userService.findCurrentUser();
        UserKanza userCustomize = userCustomizeRepository.findUserCustomizeByUserIdAndKanziId(userModel, kanza);
        if (isWin)
        {
            userCustomize.setParameter(userCustomize.getParameter() + 1);
        }
        else
        {
            userCustomize.setParameter(userCustomize.getParameter() - 1);
        }
        userCustomizeRepository.save(userCustomize);
    }
}
