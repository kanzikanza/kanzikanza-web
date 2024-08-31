package com.example.restservice.controllers;

import com.example.restservice.dtos.KanzaUniteDtos;
import com.example.restservice.kanza.service.KanzaService;
import com.example.restservice.redis.service.RedisService;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.service.UserKanzaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanza.dto.KanzaDto;
import com.example.restservice.kanza.model.KanzaModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
// import org.springframework.web.bind.annotation.Req   uestMethod;


@Slf4j
@RestController
@RequestMapping("kanzi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KanzaRelatedController {

    private final KanzaService kanzaService;
    private final UserKanzaService userCustomizeService;
    private final RedisService redisService;
    private final UserService userService;


    @GetMapping("/kanza")
    public ResponseEntity<?> kanzikanza(@RequestParam(required = true) String kanza, String mean, String sound) {
        String str = kanzaService.kanziservice(kanza, mean, sound);
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
            List<KanzaModel> entities = kanzaService.create(tmp);
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

            List<KanzaModel> entities = kanzaService.getAllofThem();
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

            List<KanzaModel> entities = kanzaService.getTOP20();
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
            KanzaModel kanza = kanzaService.findByKANZA(inpDto.getKanza());
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
        KanzaModel kanzaModel = kanzaService.findByKANZA(kanza);
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




    @GetMapping("/getTestProblems")
    public ResponseEntity<?> getTestProblems(@RequestParam(required = true) Integer levels, Integer days)
    {
        Integer length = 20;

        UserModel userModel = userService.findCurrentUser();
        // 캐시에서 문제가 있다면 가져오는 과정을 걸침
        try {
            Integer fromCache = redisService.getCachedNumber(userModel.getUserIndex().toString());
            if (fromCache < 4)
            {
                length -= fromCache;
            }
            else if (fromCache < 6)
            {
                length -= 3;
            }
            else
            {
                length -= 5;
            }
        } catch (NullPointerException e)
        {
            log.error("에러 발생");
            length = 20;
        }
        List<KanzaModel> kanzaModels = kanzaService.getTestProblems(levels, length );
        List<KanzaDto> kanzaDtos = redisService.redisGetNCache(userModel.getUserIndex().toString(), 20 - length);


        KanzaUniteDtos.TestProblems testProblems =  KanzaUniteDtos.TestProblems.builder().build();


        testProblems.setTestLevel(levels);
        testProblems.setDays(days);
        testProblems.setLength(length);

        List<KanzaUniteDtos.Problem> problems = new ArrayList<>();

        for (KanzaDto kanzaDto : kanzaDtos) {
            KanzaModel kanzaModel = kanzaService.findByKANZA(kanzaDto.getKANZA());
            KanzaUniteDtos.Problem problem = kanzaService.returnProblemDto(kanzaModel, 1);
            problem.setProblemIndex(problems.size());
            problems.add(problem);
        }

        // 캐시로 받은 문제들을 어떻게 할지를 고민 일단 리스트에 전부 합칠건데 이 로직을 분리하는게 나을듯
        kanzaModels.forEach(x ->
                {
                    KanzaUniteDtos.Problem problem = kanzaService.returnProblemDto(x, 0);
                    problem.setProblemIndex(problems.size());
                    problems.add(problem);
                });

        // 렌덤으로 섞는것 추가
        Collections.shuffle(problems);
        testProblems.setProblems(problems);
        return ResponseEntity.ok().body(testProblems);
    }

    @PostMapping("/logTest")
    public ResponseEntity<?> logTest(@RequestBody(required = true)KanzaUniteDtos.LogApi logApi)
    {
        UserModel userModel = userService.findCurrentUser();
        // 일단 사용자의 테스트로그는 시험 시작 API에 맡긴다 여기서는 있다고 가정함

        // Todo: 나중에 세션 아이디 검증해야함
        // 틀렸을때도 업데이트를 해주긴 해야함 그니까 redisService에서 로직을 다처리하는게 맞음
        KanzaUniteDtos.ProblemLog problemLog = logApi.getProblem();
        Integer dResult = redisService.redisUpdateTestSession(userModel.getUserIndex().toString(), problemLog.getKanzaIndex().toString(),
                problemLog.getIsRight());
        if (dResult.equals(1))
        {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("적용 성공");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("시험 업데이트 실패");
        }
    }



}