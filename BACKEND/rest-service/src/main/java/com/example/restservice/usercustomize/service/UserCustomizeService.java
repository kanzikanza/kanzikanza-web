package com.example.restservice.usercustomize.service;

import com.example.restservice.kanzi.model.Kanza;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.usercustomize.model.UserCustomize;
import org.springframework.stereotype.Service;
import com.example.restservice.usercustomize.repository.UserCustomizeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserCustomizeService {
    private final UserCustomizeRepository userCustomizeRepository;
    private final UserService userService;
    public void updateOnSignUp(UserModel userModel){
        userCustomizeRepository.CreateAllRelationsByUser(userModel.getId());
    }

    public void updateParameter(Kanza kanza, Boolean isWin) {
        UserModel userModel = userService.findCurrentUser();
        UserCustomize userCustomize = userCustomizeRepository.findUserCustomizeByUserIdAndKanziId(userModel, kanza);
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
