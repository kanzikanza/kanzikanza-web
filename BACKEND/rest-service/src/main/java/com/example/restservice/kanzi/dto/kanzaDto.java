package com.example.restservice.kanzi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.restservice.kanzi.model.Kanza;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data

public class kanzaDto {
    private String KANZA;
    private String MEAN;
    private String SOUND;

    public kanzaDto(final Kanza entity) {
        this.KANZA = entity.getKANZA();
        this.MEAN = entity.getMEAN();
        this.SOUND = entity.getSOUND();
    }

    public static Kanza toKanza(final kanzaDto dto) {
        return Kanza.builder()
                .KANZA(dto.getKANZA())
                .MEAN(dto.getMEAN())
                .SOUND(dto.getSOUND())
                .build();
    }
}
