package com.example.restservice.neo4j.dto;

import lombok.*;
import java.util.List;

import com.example.restservice.neo4j.entity.KanzaModelNeo4j;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;

@Getter
@Setter
@Builder
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
public class KandleInitDataDtos {

    @JsonIgnore
    private KandleWord kandleWord;
    private List<KandleKanza> kandleKanzas;

    @Getter
    @Setter
    @Builder
    public static class KandleWord {
        String kandleWord;
        List<KandleKanza> kandleWordKanzas;
    }

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KandleKanza {
        String kanzaKanza;
        String kanzaMean;
        String kanzaSound;

        public static KandleKanza fromModel(KanzaModelNeo4j kanzaModelNeo4j) {
            return KandleKanza.builder()
                    .kanzaKanza(kanzaModelNeo4j.getKanzaLetter())
                    .kanzaMean(kanzaModelNeo4j.getKanzaMean())
                    .kanzaSound(kanzaModelNeo4j.getKanzaSound())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class KandleInitRequest {
        String uniqueId;
    }

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KandleSessionRequest {
        String data;
    }

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KandleKanzaResponse {
        String kanza;
        // 0: 없음, 1: 노란색, 2: 초록색
        Integer state;
    }

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KandleSessionResponse {

        String uniqueId;
        Integer answerLength;
        List<List<KandleKanzaResponse>> responses;
        List<KandleKanza> kandleWordKanzas;
    }
}
