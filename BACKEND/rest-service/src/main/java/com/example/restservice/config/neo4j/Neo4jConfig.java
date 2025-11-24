package com.example.restservice.config.neo4j;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

@Configuration
@EnableTransactionManagement
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

        @Bean
        public Neo4jTransactionManager transactionManager(Driver driver) {
                return new Neo4jTransactionManager(driver);
        }

        // @Bean
        // // @ConditionalOnProperty(name = "spring.neo4j.enabled", havingValue =
        // "true")
        // public TransactionTemplate
        // transactionTemplateReadOnly(PlatformTransactionManager transactionManager) {
        // TransactionTemplate tt = new TransactionTemplate(transactionManager);
        // tt.setReadOnly(true);
        // tt.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        // return tt;
        // }

        // // 쓰기용도 필요하면 같이 만들어라
        // @Bean
        // // @ConditionalOnProperty(name = "spring.neo4j.enabled", havingValue =
        // "true")
        // public TransactionTemplate
        // transactionTemplateWrite(PlatformTransactionManager transactionManager) {
        // return new TransactionTemplate(transactionManager);
        // }
}
