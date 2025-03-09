package com.example.restservice.config.neo4j;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// import lombok.Value;

@Configuration
public class Neo4jConfig {
        @Value("${spring.neo4j.uri}")
        String uri;
        @Value("${spring.neo4j.authentication.username}")
        String id;
        @Value("${spring.neo4j.authentication.password}")
        String password;

        @Bean
        @ConditionalOnProperty(name = "spring.neo4j.enabled", havingValue = "true")
        public Driver neo4jDriver() {
                return GraphDatabase.driver(
                                uri,
                                AuthTokens.basic(id, password));
        }
}
