package com.example.restservice.kanzi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.ArrayList;
// import org.hibernate.mapping.List;

import com.example.restservice.kanzi.model.kanza;

@Slf4j
@Service

public class kanziService {
    @Autowired
    private kanzaRepository repository;

    public String kanziservice(String kanzi, String mean, String sound) {
        kanza kanzikanza = kanza.builder().KANZA(kanzi).MEAN(mean).SOUND(sound).build();
        repository.save(kanzikanza);

        kanza returnValue = repository.findById(kanzikanza.getId()).get();
        return returnValue.getKANZA();
    }

    public List<kanza> create(final kanza kanza) {

        validate(kanza);

        System.out.println(repository.findByKANZA(kanza.getKANZA()));
        if (repository.findByKANZA(kanza.getKANZA()).isEmpty()) {
            repository.save(kanza);
            log.info("한자가 저장되었음", kanza.getId());
        }

        // return repository.findById(kanza.getId());
        return repository.findBySOUND(kanza.getSOUND());

    }

    public List<kanza> getAllofThem() {
        return repository.findAll();
    }

    public List<kanza> getTOP20() {
        return repository.findTop20ByOrderByIdDesc();
    }

    private void validate(final kanza kanza) {
        if (kanza == null) {
            log.warn("추가될 수가 없음");
            throw new RuntimeJsonMappingException("kanza cannot be null");
        }

    }
}
