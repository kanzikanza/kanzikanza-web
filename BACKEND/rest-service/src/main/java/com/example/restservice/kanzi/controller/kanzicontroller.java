package com.example.restservice.kanzi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanzi.service.kanziService;
import com.example.restservice.kanzi.dto.kanzaDto;
import com.example.restservice.kanzi.dto.kanziDto;
import com.example.restservice.kanzi.model.kanza;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
// import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("kanzi")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/kanza")
    public ResponseEntity<?> createKanza(@RequestBody kanzaDto kanza) {
        // TODO: process POST request
        try {
            kanza tmp = kanzaDto.toKanza(kanza);
            tmp.setId(null);
            List<kanza> entities = repo.create(tmp);

            List<kanzaDto> dtos = entities.stream().map(kanzaDto::new).collect(Collectors.toList());
            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().data(dtos).build();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> getKanza() {
        try {

            List<kanza> entities = repo.getAllofThem();
            List<kanzaDto> dtos = entities.stream().map(kanzaDto::new).collect(Collectors.toList());
            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }

    @GetMapping("/problem")
    public ResponseEntity<?> getTOP20() {
        try {

            List<kanza> entities = repo.getTOP20();
            List<kanzaDto> dtos = entities.stream().map(kanzaDto::new).collect(Collectors.toList());
            // List<kanzaDto> dtos =
            // entities.stream().map(kanzaDto::new).collect(Collectors.toList());

            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            String error = e.getMessage();
            kanziDto<kanzaDto> response = kanziDto.<kanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

}