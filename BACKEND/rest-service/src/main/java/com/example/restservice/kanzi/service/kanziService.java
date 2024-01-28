package com.example.restservice.kanzi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanzi.model.kanza;

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
}
