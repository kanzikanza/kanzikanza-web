package com.example.restservice.config.jwt;

import com.example.restservice.user.UserEntity;
import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.autoconfigure.ssl.SslBundleProperties.Key;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Service
public class TokenProvider {
        private static final String SECRET_KEY = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
        // final String key = "Bamdule";
        // 내가 임의로 정한 비밀키

        // 그냥 Jwts를 이용해 토큰을 만들어주기만하는 녀석
        public String create(UserEntity userEntity) {
                Date expiryDate = Date.from(
                                Instant.now()
                                                .plus(1, ChronoUnit.DAYS));
                // time모듈을 쓰면 파이썬에서 ㅈ같았던거 많이 해결할 수 있는듯

                return Jwts.builder()
                                .signWith(SignatureAlgorithm.HS512,
                                                SECRET_KEY)
                                .setSubject(userEntity.getId())
                                .setIssuer("demo app")
                                .setIssuedAt(new Date())
                                .setExpiration(expiryDate)
                                .compact();
        }

        // 토큰을 파싱하고 디코딩하고, 결과적으로 위조여부를 파악한다.결과적으론 userId를 뱉어내는데 같은 user가 요청한 것인지 맞는지 알 수
        // 있다 .

        public String validateAndGetUserId(String token) {
                Claims claims = Jwts.parser()
                                .setSigningKey(SECRET_KEY)
                                .parseClaimsJws(token)
                                .getBody();
                return claims.getSubject();
        }
}
