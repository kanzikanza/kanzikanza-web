package com.example.restservice.controllers;

import com.example.restservice.dtos.KanzaUniteDtos;
import com.example.restservice.kanza.service.KanzaService;
import com.example.restservice.redis.service.RedisService;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.service.UserKanzaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanza.dto.KanzaDto;
import com.example.restservice.kanza.model.KanzaModel;

import java.util.ArrayList;
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

        for (KanzaDto kanzaDto : kanzaDtos) {
            KanzaModel kanzaModel = kanzaService.findByKANZA(kanzaDto.getKANZA());
            kanzaModels.add(kanzaModel);
        }
        int availableProblemType = 3;
        int maxAnswerOption = 4;
        KanzaUniteDtos.TestProblems testProblems =  KanzaUniteDtos.TestProblems.builder().build();

        testProblems.setTestLevel(levels);
        testProblems.setDays(days);
        testProblems.setLength(length);

        List<KanzaUniteDtos.Problem> problems = new ArrayList<>();
        Random random = new Random();


        // 캐시로 받은 문제들을 어떻게 할지를 고민 일단 리스트에 전부 합칠건데 이 로직을 분리하는게 나을듯
        // ToDo : x에서 problem만드는 로직을 fromCache냐 아니냐에 따라서 나눌 필요가 있음 새로운 함수 생성
        kanzaModels.forEach(x ->
                {
                    int problemType = random.nextInt(availableProblemType);
                    int answerOption = random.nextInt(maxAnswerOption);

                    KanzaUniteDtos.Problem problem =  KanzaUniteDtos.Problem.builder()
                            .problemType(problemType)
                            .answer(answerOption)
                            .isFromCache(0)
                            .build();
                    List<String> options = new ArrayList<>();
                    problem.setProblemIndex(x.getKanzaIndex());


                    if (problemType == 0)
                    {
                        problem.setProblemContent(x.getKanzaMean() + " " + x.getKanzaSound());
                        for (int i = 0; i < maxAnswerOption; i++){
                            if (i == answerOption)
                            {
                                options.add(x.getKanzaLetter());
                            }
                            else
                            {
                                boolean isOverlap = false;
                                while (true)
                                {
                                    KanzaModel wrongAnswerKanza = kanzaService.findRelatedKanza(x.getKanzaIndex());
                                    for (String option : options) {
                                        if (option.equals(wrongAnswerKanza.getKanzaLetter()))
                                        {
                                            isOverlap = true;
                                            break;
                                        }
                                    }
                                    if (isOverlap)
                                    {
                                        continue;
                                    }
                                    options.add(wrongAnswerKanza.getKanzaLetter());
                                    break;
                                }
                            }
                        }
                    }
                    else if (problemType == 1)
                    {
                        problem.setProblemContent(x.getKanzaLetter());
                        for (int i = 0; i < maxAnswerOption; i++){
                            if (i == answerOption)
                            {
                                options.add(x.getKanzaMean());
                            }
                            else
                            {
                                boolean isOverlap = false;
                                    while (true) {
                                        KanzaModel wrongAnswerKanza = kanzaService.findRelatedKanza(x.getKanzaIndex());
                                        for (String option : options) {
                                            if (option.equals(wrongAnswerKanza.getKanzaMean()))
                                            {
                                                isOverlap = true;
                                                break;
                                            }
                                        }
                                        if (isOverlap)
                                        {
                                            continue;
                                        }
                                        options.add(wrongAnswerKanza.getKanzaMean());
                                        break;
                                }
                            }
                        }
                    }
                    else if (problemType == 2)
                    {
                        problem.setProblemContent(x.getKanzaLetter());
                        for (int i = 0; i < maxAnswerOption; i++){
                            if (i == answerOption)
                            {
                                options.add(x.getKanzaSound());
                            }
                            else
                            {
                                boolean isOverlap = false;
                                while (true) {
                                    KanzaModel wrongAnswerKanza = kanzaService.findRelatedKanza(x.getKanzaIndex());
                                    for (String option : options) {
                                        if (option.equals(wrongAnswerKanza.getKanzaSound()))
                                        {
                                            isOverlap = true;
                                            break;
                                        }
                                    }
                                    if (isOverlap)
                                    {
                                        continue;
                                    }
                                    options.add(wrongAnswerKanza.getKanzaSound());
                                    break;
                                }
                            }
                        }
                    }
                    problem.setOptions(options);
                    problems.add(problem);
                });
        testProblems.setProblems(problems);
        return ResponseEntity.ok().body(testProblems);
    }

}