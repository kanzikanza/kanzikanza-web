package com.example.restservice.kanza.dto;

import lombok.*;
import com.example.restservice.kanza.model.KanzaModel;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Data
public class KanzaDto {
    private String KANZA;
    private String MEAN;
    private String SOUND;

    public KanzaDto(final KanzaModel entity) {
        this.KANZA = entity.getKanzaLetter();
        this.MEAN = entity.getKanzaMean();
        this.SOUND = entity.getKanzaSound();
    }

    public static KanzaModel toKanza(final KanzaDto dto) {
        return KanzaModel.builder()
                .kanzaLetter(dto.getKANZA())
                .kanzaMean(dto.getMEAN())
                .kanzaSound(dto.getSOUND())
                .build();
    }
}
