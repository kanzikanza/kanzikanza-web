package com.example.restservice.kanza.controller;

import com.example.restservice.dtos.KanzaUniteDtos;
import com.example.restservice.redis.service.RedisService;
import com.example.restservice.userKanza.service.UserKanzaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanza.service.KanziService;
import com.example.restservice.kanza.dto.KanzaDto;
import com.example.restservice.kanza.model.KanzaModel;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
// import org.springframework.web.bind.annotation.Req   uestMethod;


@Slf4j
@RestController
@RequestMapping("kanzi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class Kanzicontroller {

    private final KanziService kanziService;
    private final UserKanzaService userCustomizeService;
    private final RedisService redisService;


    @GetMapping("/kanza")
    public ResponseEntity<?> kanzikanza(@RequestParam(required = true) String kanza, String mean, String sound) {
        String str = kanziService.kanziservice(kanza, mean, sound);
        List<String> list = new ArrayList<>();
        list.add(str);
        KanzaUniteDtos.KanziDto<String> response = KanzaUniteDtos.KanziDto.<String>builder().data(list).build();
        return ResponseEntity.ok().body(response);
    }
    @PostMapping("/kanza")
    public ResponseEntity<?> createKanza(@RequestBody KanzaDto kanza) {
        // TODO: process POST request
        try {
            KanzaModel tmp = KanzaDto.toKanza(kanza);
            List<KanzaModel> entities = kanziService.create(tmp);
            List<KanzaDto> dtos = entities.stream().map(KanzaDto::new).collect(Collectors.toList());
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().data(dtos).build();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> getKanza() {
        try {

            List<KanzaModel> entities = kanziService.getAllofThem();
            List<KanzaDto> dtos = entities.stream().map(KanzaDto::new).collect(Collectors.toList());
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }

    @GetMapping("/problem")
    public ResponseEntity<?> getTOP20() {
        try {

            List<KanzaModel> entities = kanziService.getTOP20();
            List<KanzaDto> dtos = entities.stream().map(KanzaDto::new).collect(Collectors.toList());
            // List<KanzaDto> dtos =
            // entities.stream().map(KanzaDto::new).collect(Collectors.toList());

            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            String error = e.getMessage();
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PatchMapping("/isRight")
    public ResponseEntity<?> isRight(@RequestBody KanzaUniteDtos.InpDto.isRight inpDto)
    {
        try
        {
            KanzaModel kanza = kanziService.findByKANZA(inpDto.getKanza());
            userCustomizeService.updateParameter(kanza, inpDto.isWin());
            return ResponseEntity.ok(HttpStatus.OK);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getKanza")
    public ResponseEntity<?> getKanza(@RequestParam(required = true) String kanza)
    {
        KanzaModel kanzaModel = kanziService.findByKANZA(kanza);
        log.info(kanzaModel.getKanzaIndex().toString() + " 번 한자");
        try {
            KanzaDto kanzaDto = redisService.getCacheKanza(kanzaModel.getKanzaIndex()).orElseThrow();
            log.info("redisService.getCacheKanza: 성공");
            return ResponseEntity.ok().body(kanzaDto);
        } catch(Exception e) {
            log.info("redisService.getCacheKanza: 실패");
            return ResponseEntity.ok().body(redisService.cacheKanza(kanzaModel));
        }
    }
}