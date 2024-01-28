package com.example.restservice.kanzi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.restservice.kanzi.model.kanza;

@NoArgsConstructor
@Builder
@Data

public class kanzaDto<T> {
    private String KANZA;
    private String MEAN;
    private String SOUND;

    public kanzaDto(final kanza entity) {
        this.KANZA = entity.getKANZA();
        this.MEAN = entity.getMEAN();
        this.SOUND = entity.getSOUND();
    }
}
