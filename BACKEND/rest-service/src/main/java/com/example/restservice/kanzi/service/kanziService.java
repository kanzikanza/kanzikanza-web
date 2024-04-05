package com.example.restservice.kanzi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.restservice.kanzi.persistence.KanzaRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
// import org.hibernate.mapping.List;

import com.example.restservice.kanzi.model.Kanza;

@Slf4j
@Service

public class KanziService {
    @Autowired
    private KanzaRepository kanzaRepository;

    public String kanziservice(String kanzi, String mean, String sound) {
        Kanza kanzikanza = Kanza.builder().KANZA(kanzi).MEAN(mean).SOUND(sound).build();
        kanzaRepository.save(kanzikanza);

        Kanza returnValue = kanzaRepository.findById(kanzikanza.getId()).get();
        return returnValue.getKANZA();
    }

    public List<Kanza> create(final Kanza kanza) {

        validate(kanza);

        System.out.println(kanzaRepository.findByKANZA(kanza.getKANZA()));
        if (kanzaRepository.findByKANZA(kanza.getKANZA()) == null) {
            kanzaRepository.save(kanza);
            log.info("한자가 저장되었음", kanza.getId());
        }

        // return kanzaRepository.findById(kanza.getId());
        return kanzaRepository.findBySOUND(kanza.getSOUND());

    }

    public List<Kanza> getAllofThem() {
        return kanzaRepository.findAll();
    }

    public List<Kanza> getTOP20() {
        return kanzaRepository.getKanzasByRandom(20);
    }

    private void validate(final Kanza kanza) {
        if (kanza == null) {
            log.warn("추가될 수가 없음");
            throw new RuntimeJsonMappingException("kanza cannot be null");
        }
    }

    public Kanza findByKANZA(String KANZA)
    {
        return kanzaRepository.findByKANZA(KANZA);
    }
}
