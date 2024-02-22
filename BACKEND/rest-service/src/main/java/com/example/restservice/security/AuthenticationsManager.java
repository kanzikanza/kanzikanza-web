package com.example.restservice.security;

// import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthenticationsManager {

    void authent() {

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        // Authentication authentication = new TestingAuthenticationToken("username",
        // "password", "ROLE_USER");
        // Authentication authentication = new
        // UsernamePasswordAuthenticationToken("username", "password");
        Authentication authentication = new TestingAuthenticationToken("username",
                "password", "ROLE_USER");

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

}
