package com.example.restservice.config.jwt;

import lombok.Builder;
import lombok.Getter;
import java.util.Map;

import org.springframework.security.web.header.Header;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

@Getter
public class JwtFactory {
    private String subject = "test@email.com";
    private Date issuedAt = new Date();
    private Date expiration = new Date(new Date().getTime() + Duration.ofDays(14).toMillis());
    private Map<String, Object> claims = emptyMap();

    @Builder
    public JwtFactory(String subject, Date issuedAt, Date expiration, Map<String, Object> cliams) {
        this.subject = subject != null ? subject : this.subject;
        this.issuedAt = issuedAt != null ? issuedAt : this.issuedAt;
        this.expiration = expiration != null ? expiration : this.expiration;
        this.claims = claims != null ? claims : this.claims;
    }

    public static JwtFactory withDefaultValues() {
        return JwtFactory.builder().build();
    }

    public String createToken(JwtProperties jwtProperties) {
        return Jwts.builder()
        .setSubject(subject)
        .setHeaderParam(Header.TYPE , Header.JWT_TYPE)
        .setIssuer(subject)
        .setIssuedAt(issuedAt)
        .setExpiration(expiration)
        .addClaims(claims)
                .signWith(SignatureAlgorithm.HS512, );
    }
}
