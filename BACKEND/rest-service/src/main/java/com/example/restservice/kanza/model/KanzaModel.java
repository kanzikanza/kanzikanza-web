package com.example.restservice.kanza.model;

import com.example.restservice.test.model.TestModel;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "kanza")
public class KanzaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kanzaIndex;

    @JoinColumn(name = "test_index")
    @ManyToOne
    private TestModel testModel;

    private String kanzaLetter;
    private String kanzaSound;
    private String kanzaMean;
}
