package com.example.restservice.neo4j.entity.relationship;

import com.example.restservice.neo4j.entity.KanzaWord;
import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.TargetNode;

@Data
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
