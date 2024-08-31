package com.example.restservice.security;

import com.example.restservice.user.model.UserModel;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.restservice.security.dto.UserPrincipal;
import java.util.List;

@Component
public class JwtToPrincipalConverter {
    public UserPrincipal convert(DecodedJWT jwt) {
        return UserPrincipal.builder()
                .userIndex(Long.valueOf(jwt.getSubject()))
                .authorities(null)
                .build();
    }

    public UserPrincipal convertUserModel(UserModel userModel)
    {
        return UserPrincipal.builder()
                .userIndex(userModel.getUserKakaoSerial())
                .userEmail(userModel.getUserEmail())
                .authorities(null)
                .build();
    }

    private List<SimpleGrantedAuthority> extracAuthoritiesFromClaim(DecodedJWT jwt) {
        var claim = jwt.getClaim("a");
        if (claim.isNull() || claim.isMissing())
            return List.of();
        return claim.asList(SimpleGrantedAuthority.class);
    }
}
