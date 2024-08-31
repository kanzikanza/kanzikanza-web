package com.example.restservice.security;

import com.example.restservice.config.kakao.KakaoApi;
import com.example.restservice.dtos.UserUniteDtos;
import com.example.restservice.security.dto.UserPrincipal;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtDecoder jwtDecoder;
    private final JwtToPrincipalConverter jwtToPrincipalConverter;
    private final UserService userService;
    private final KakaoApi kakaoApi;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

//        extractAuthoritiesFromClaim(request)
//                .map(jwtDecoder::decode)
//                .map(jwtToPrincipalConverter::convert)
//                .map(UserPrincipalAuthenticationToken::new)
//                .ifPresent(authentication -> SecurityContextHolder.getContext().setAuthentication(authentication));
        extractAuthoritiesFromClaim(request)
                .map(kakaoApi::getValidUser)
                .map(UserUniteDtos.ValidateResponse::getId)
                .map(userService::findUserModelByUserKakaoSerial)
                .map(jwtToPrincipalConverter::convertUserModel)
                .map(UserPrincipalAuthenticationToken::new)
                .ifPresent(authentication -> SecurityContextHolder.getContext().setAuthentication(authentication));

//        String token = extractAuthoritiesFromClaim(request).ifPresent();
//        UserUniteDtos.ValidateResponse validateResponse = kakaoApi.getValidUser(token);
//        UserModel userModel = userService.findUserModelByUserKakaoSerial(validateResponse.getId());
//        UserPrincipal userPrincipal = jwtToPrincipalConverter.convertUserModel(userModel);
//        UserPrincipalAuthenticationToken userPrincipalAuthenticationToken = new  UserPrincipalAuthenticationToken(userPrincipal);
//        SecurityContextHolder.getContext().setAuthentication(userPrincipalAuthenticationToken);
        // 여기서 받은 아이디로 유저 모델을 만들고 그 유저모델을 넣어야함
        filterChain.doFilter(request, response);
    }

    private Optional<String> extractAuthoritiesFromClaim(HttpServletRequest request) {
        var token = request.getHeader("Authorization");
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            log.info(token.substring(7));
            return Optional.of(token.substring(7));
        }
        return Optional.empty();
    }
}
