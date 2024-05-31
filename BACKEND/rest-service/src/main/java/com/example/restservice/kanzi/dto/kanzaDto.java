package com.example.restservice.kanzi.dto;

import lombok.*;
import com.example.restservice.kanzi.model.Kanza;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
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
