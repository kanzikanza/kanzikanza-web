package com.example.restservice.neo4j.entity;

import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import lombok.*;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Set;

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
    @Relationship("Included") // direction can be OUTGOING (default) or INCOMING
    private Set<KanzaIncluded> IncludedWords;
}
