package com.example.restservice.neo4j.entity.relationship;

import com.example.restservice.neo4j.entity.KanzaWord;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

@Data
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RelationshipProperties
public class KanzaIncluded {
    @Id @GeneratedValue
    private Long index;
    @TargetNode
    KanzaWord kanzaWord;
    @Property
    Integer order;
    @Property
    String startId;
}
