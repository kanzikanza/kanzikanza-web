package com.example.restservice.neo4j.entity;

import lombok.*;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Property;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanzaWord {
    @Id
    private String wordName;
    @Property
    private String wordKorean;
    @Property
    private String wordMean;
}
