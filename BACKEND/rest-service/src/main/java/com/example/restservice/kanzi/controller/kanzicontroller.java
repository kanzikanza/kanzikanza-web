package com.example.restservice.kanzi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanzi.service.kanziService;
// import com.example.restservice.kanzi.dto.kanzaDto;
import com.example.restservice.kanzi.dto.kanziDto;

import java.util.ArrayList;
import java.util.List;
// import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("kanzi")
public class kanzicontroller {

    @Autowired
    private kanziService repo;

    @GetMapping("/kanza")
    public ResponseEntity<?> kanzikanza(@RequestParam(required = true) String kanza, String mean, String sound) {
        String str = repo.kanziservice(kanza, mean, sound);
        List<String> list = new ArrayList<>();
        list.add(str);
        kanziDto<String> response = kanziDto.<String>builder().data(list).build();
        return ResponseEntity.ok().body(response);
    }
}
