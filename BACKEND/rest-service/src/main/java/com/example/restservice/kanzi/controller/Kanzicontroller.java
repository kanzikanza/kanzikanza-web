package com.example.restservice.kanzi.controller;

import com.example.restservice.kanzi.dto.InpDto;
import com.example.restservice.usercustomize.service.UserCustomizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanzi.service.KanziService;
import com.example.restservice.kanzi.dto.kanzaDto;
import com.example.restservice.kanzi.dto.kanziDto;
import com.example.restservice.kanzi.model.Kanza;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
// import org.springframework.web.bind.annotation.RequestMethod;


@RestController
@RequestMapping("kanzi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class Kanzicontroller {

    private final KanziService kanziService;
    private final UserCustomizeService userCustomizeService;


    @GetMapping("/kanza")
    public ResponseEntity<?> kanzikanza(@RequestParam(required = true) String kanza, String mean, String sound) {
        String str = kanziService.kanziservice(kanza, mean, sound);
        List<String> list = new ArrayList<>();
        list.add(str);
        kanziDto<String> response = kanziDto.<String>builder().data(list).build();
        return ResponseEntity.ok().body(response);
    }
    @PostMapping("/kanza")
    public ResponseEntity<?> createKanza(@RequestBody kanzaDto kanza) {
        // TODO: process POST request
        try {
            Kanza tmp = kanzaDto.toKanza(kanza);
            tmp.setId(null);
            List<Kanza> entities = kanziService.create(tmp);

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

            List<Kanza> entities = kanziService.getAllofThem();
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

            List<Kanza> entities = kanziService.getTOP20();
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

    @PatchMapping("/isRight")
    public ResponseEntity<?> isRight(@RequestBody InpDto.isRight inpDto)
    {
        try
        {
            Kanza kanza = kanziService.findByKANZA(inpDto.getKanza());
            userCustomizeService.updateParameter(kanza, inpDto.isWin());
            return ResponseEntity.ok(HttpStatus.OK);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}