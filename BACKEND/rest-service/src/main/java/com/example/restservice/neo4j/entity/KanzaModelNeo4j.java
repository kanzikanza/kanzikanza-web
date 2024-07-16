package com.example.restservice.neo4j.entity;

import com.example.restservice.neo4j.entity.relationship.KanzaIncluded;
import jakarta.persistence.Entity;
import lombok.*;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;
import java.util.Set;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanzaModelNeo4j {
    @Id
    private String kanzaLetter;
    @Property
    private String kanzaSound;
    @Property
    private String kanzaMean;
    @Relationship(type = "Included", direction = Relationship.Direction.OUTGOING)
    Set<KanzaIncluded> kanzaIncludedList;
}
