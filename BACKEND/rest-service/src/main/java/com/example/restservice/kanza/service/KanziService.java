package com.example.restservice.kanza.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.restservice.kanza.persistence.KanzaRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
// import org.hibernate.mapping.List;

import com.example.restservice.kanza.model.KanzaModel;

@Slf4j
@Service
@RequiredArgsConstructor
public class KanziService {
    private final KanzaRepository kanzaRepository;

    public String kanziservice(String kanzi, String mean, String sound) {
        KanzaModel kanzikanza = KanzaModel.builder().kanzaLetter(kanzi)
                .kanzaMean(mean)
                .kanzaSound(sound).build();
        kanzaRepository.save(kanzikanza);

        KanzaModel returnValue = kanzaRepository.findById(kanzikanza.getKanzaIndex()).get();
        return returnValue.getKanzaLetter();
    }

    public List<KanzaModel> create(final KanzaModel kanza) {

        validate(kanza);

        System.out.println(kanzaRepository.findByKanzaLetter(kanza.getKanzaLetter()));
        if (kanzaRepository.findByKanzaLetter(kanza.getKanzaMean()) == null) {
            kanzaRepository.save(kanza);
            log.info("한자가 저장되었음", kanza.getKanzaIndex());
        }
        // return kanzaRepository.findById(kanza.getId());
        return kanzaRepository.findByKanzaSound(kanza.getKanzaSound());

    }

    public KanzaModel findByKanzaIndex(Integer kanzaIndex)
    {
        return kanzaRepository.findByKanzaIndex(kanzaIndex);
    }

    public List<KanzaModel> getAllofThem() {
        return kanzaRepository.findAll();
    }

    public List<KanzaModel> getTOP20() {
        return kanzaRepository.findKanzasByRandom(20);
    }

    private void validate(final KanzaModel kanza) {
        if (kanza == null) {
            log.warn("추가될 수가 없음");
            throw new RuntimeJsonMappingException("kanza cannot be null");
        }
    }

    public KanzaModel findByKANZA(String KANZA) {
        return kanzaRepository.findByKanzaLetter(KANZA);
    }
}
