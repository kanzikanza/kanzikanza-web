package com.example.restservice.neo4j.dto;

import java.util.List;

import com.example.restservice.neo4j.dto.KandleInitDataDtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class KandleApiResponses {

    @Getter
    @Setter
    @Builder
    public static class KandleUpdateApiResponse {
        List<KandleInitDataDtos.KandleKanzaResponse> kandleKanzaResponses;
        Integer position;
        String answer;
    }
}
