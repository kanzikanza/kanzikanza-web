package com.example.restservice.controllers;

import com.example.restservice.dtos.KanzaUniteDtos;
import com.example.restservice.dtos.KanzaUniteDtos.KanzaDtoList;
import com.example.restservice.dtos.KanzaUniteDtos.TestUpdateDate;
import com.example.restservice.kanza.service.KanzaService;
import com.example.restservice.redis.model.RedisTestSession;
import com.example.restservice.redis.service.RedisService;
import com.example.restservice.user.UserService;
import com.example.restservice.user.model.UserModel;
import com.example.restservice.userKanza.model.UserKanza;
import com.example.restservice.userKanza.service.UserKanzaService;
import com.example.restservice.userTest.model.UserTestModel;
import com.example.restservice.userTest.service.UserTestService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.Req   uestMethod;
import org.springframework.web.bind.annotation.*;

// import com.example.restservice.kanzi.persistence.kanzaRepository;
import com.example.restservice.kanza.dto.KanzaDto;
import com.example.restservice.kanza.model.KanzaModel;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("kanzi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KanzaRelatedController {

    private final KanzaService kanzaService;
    private final UserKanzaService userCustomizeService;
    private final UserTestService userTestService;
    private final RedisService redisService;
    private final UserService userService;

    @GetMapping("/test")
    public ResponseEntity<?> getKanza() {
        try {

            List<KanzaModel> entities = kanzaService.getAllofThem();
            List<KanzaDto> dtos = entities.stream().map(KanzaDto::new).collect(Collectors.toList());
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            KanzaUniteDtos.KanziDto<KanzaDto> response = KanzaUniteDtos.KanziDto.<KanzaDto>builder().error(error)
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

    }

    @GetMapping("/getKanza")
    public ResponseEntity<?> getKanza(@RequestParam(required = true) String kanza) {
        KanzaModel kanzaModel = kanzaService.findByKANZA(kanza);
        log.info(kanzaModel.getKanzaIndex().toString() + " 번 한자");
        try {
            KanzaDto kanzaDto = redisService.getCacheKanza(kanzaModel.getKanzaIndex()).orElseThrow();
            log.info("redisService.getCacheKanza: 성공");
            return ResponseEntity.ok().body(kanzaDto);
        } catch (Exception e) {
            log.info("redisService.getCacheKanza: 실패");
            return ResponseEntity.ok().body(redisService.cacheKanza(kanzaModel));
        }
    }

    @GetMapping("/getTestProblem")
    public ResponseEntity<?> getMethodName(@RequestParam(required = true) Integer levels, Integer days) {
        UserModel userModel = userService.findCurrentUser();
        KanzaUniteDtos.TestProblems testProblems = kanzaService.kanzaTestProblemService
                .createNewTest(userModel.getUserIndex(), levels, days);
        return ResponseEntity.ok().body(testProblems);
    }

    @GetMapping("/getSessionExisted")
    public ResponseEntity<?> getSessionExisted(@RequestParam(required = true) Integer levels, Integer days) {
        UserModel userModel = userService.findCurrentUser();
        KanzaUniteDtos.ResposneGetSessionExisted response = KanzaUniteDtos.ResposneGetSessionExisted.builder()
                .userId(userModel.getUserEmail())
                .isSessionExisted(redisService.getBoolTestExists(userModel.getUserKakaoSerial(), days, levels))
                .build();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getExistingSession")
    public ResponseEntity<?> getExistingSession(@RequestParam(required = true) Integer levels, Integer days) {
        UserModel userModel = userService.findCurrentUser();

        Pair<KanzaUniteDtos.TestProblems, KanzaUniteDtos.TestMetaData> response;
        try {
            response = redisService.getAccordingTest(userModel.getUserKakaoSerial(), days, levels)
                    .orElseThrow();
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(new InternalError(e.getMessage()));
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/updateTestProgress")
    public ResponseEntity<?> updateTestProgress(@RequestBody KanzaUniteDtos.TestUpdateDate testUpdateDate) {
        // TODO: process POST request
        try {
            UserModel userModel = userService.findCurrentUser();
            if (redisService.getBoolTestExists(userModel.getUserKakaoSerial(),
                    testUpdateDate.getDays(),
                    testUpdateDate.getTestLevel()) == false) {
                log.warn("Session does not exists");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Session does not exists");
            }
            KanzaModel kanzaModel = kanzaService.findKanzaByKanzaIndex(testUpdateDate.getKanzaIndex());

            userCustomizeService.updateParameter(userModel, kanzaModel, false);

            redisService.updateTestSession(
                    userModel.getUserKakaoSerial(),
                    testUpdateDate.getDays(),
                    testUpdateDate.getTestLevel(),
                    testUpdateDate.getProblemIndex());

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.ok().body("update controll");
    }

    @GetMapping("/getFinalResults")
    public ResponseEntity<?> getFinalResults(@RequestParam(required = true) Integer levels, Integer days) {
        UserModel userModel = userService.findCurrentUser();
        try {
            try {

                UserTestModel userTestModel = userTestService
                        .findUserTestModelByUserModelAndUserTestModelAndUserTestDays(userModel, levels, days)
                        .orElseThrow();
                userTestModel.setUserTestProgress(userTestModel.getUserTestProgress() + 1);

                if (userTestModel.getUserTestProgress() == 10) {
                    userTestService.CreateTestModelWithDays(userModel, levels, days + 1);
                    log.info("getFinalResults: CreateTestModelWithDays finished");
                }
                userTestService.updateModel(userTestModel);
            } catch (Exception e) {
                log.info(e.getMessage() + ", " + Integer.valueOf(levels + 1) + ", " + days.toString());
            }
            log.info("getFinalResults: testUpdate finished");

            LocalDate lastTest = Optional.ofNullable(userModel.getUserLastTestTaken()).orElseThrow();
            // LocalDate lastTest = userModel.getUserLastTestTaken();

            if (lastTest.equals(LocalDate.now().minusDays(1))) {
                userModel.setUserStreakDays(userModel.getUserStreakDays() + 1);
            } else if (!lastTest.equals(LocalDate.now())) {
                userModel.setUserStreakDays(1);
            }
            log.info("getFinalResults: userModelStraekdays Update");

            KanzaUniteDtos.TestResultData response = KanzaUniteDtos.TestResultData.builder()
                    .isFirstTestToday(lastTest.equals(LocalDate.now()))
                    .userStreak(userModel.getUserStreakDays())
                    .wrongProblemDetail(new ArrayList<>())
                    .build();
            userModel.setUserLastTestTaken(LocalDate.now());

            userService.update(userModel);

            log.info("getFinalResults: userModel Updated");
            Pair<KanzaUniteDtos.TestProblems, KanzaUniteDtos.TestMetaData> testData;

            log.info(userModel.getUserKakaoSerial().toString() + " " + days.toString() + " " + levels.toString());
            testData = redisService.getAccordingTest(userModel.getUserKakaoSerial(), days, levels)
                    .orElseThrow();

            testData.getSecond().getWrongNumbers()
                    .forEach(x -> response.getWrongProblemDetail().add(testData.getFirst().getProblems().get(x)));

            response.setTestMetaData(testData.getSecond());
            log.info("getFinalResults: userModel Updated");
            redisService.removeRedisSession(userModel.getUserKakaoSerial(), days, levels);
            // 세션 삭제 명령
            return ResponseEntity.ok().body(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(new InternalError(e.getMessage()));
        }
    }

    @GetMapping("/getNewTestProblems")
    public ResponseEntity<?> getNewTestProblems(@RequestParam(required = true) Integer levels, Integer days) {
        UserModel userModel = userService.findCurrentUser();
        KanzaUniteDtos.TestProblems testProblems = kanzaService.createNewTest(userModel.getUserIndex(), levels, days);
        KanzaUniteDtos.TestMetaData testMetaData = KanzaUniteDtos.TestMetaData.builder()
                .totalProblem(20)
                .progress(0)
                .wrongNumbers(new ArrayList<>())
                .build();
        redisService.createNewTestSession(userModel.getUserKakaoSerial(), days, levels, testProblems);
        log.info("getNewTestProblems : createSession " + userModel.getUserKakaoSerial().toString() + " "
                + days.toString() + " "
                + levels.toString());

        Pair<KanzaUniteDtos.TestProblems, KanzaUniteDtos.TestMetaData> response = Pair.of(testProblems, testMetaData);
        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/getReviewProblems")
    public ResponseEntity<?> getReviewProblems(@RequestParam(required = true) Integer limit) {
        UserModel userModel = userService.findCurrentUser();

        ArrayList<UserKanza> userKanzas = userCustomizeService.getUserReviewData(userModel, limit);
        KanzaDtoList kanzaDtoList = KanzaDtoList.builder()
                .kanzaDtos(new ArrayList<KanzaUniteDtos.KanzaDto>())
                .number(limit)
                .minIdx(0)
                .maxIdx(0)
                .build();

        userKanzas.forEach(x -> kanzaDtoList.getKanzaDtos().add(
                KanzaUniteDtos.KanzaDto.builder()
                        .KANZA(x.getKanzaIndex().getKanzaLetter())
                        .MEAN(x.getKanzaIndex().getKanzaMean())
                        .SOUND(x.getKanzaIndex().getKanzaSound()).build()));

        return ResponseEntity.ok().body(userKanzas);
    }

    @GetMapping("/getTestProblems")
    public ResponseEntity<?> getTestProblems(@RequestParam(required = true) Integer levels, Integer days) {

        UserModel userModel = userService.findCurrentUser();
        // ToDo : 세션 있는지 확인먼저 하기

        Integer length = 20;

        try {
            Integer fromCache = redisService.getCachedNumber(userModel.getUserIndex().toString());
            if (fromCache < 4) {
                length -= fromCache;
            } else if (fromCache < 6) {
                length -= 3;
            } else {
                length -= 5;
            }
        } catch (NullPointerException e) {
            log.error("에러 발생");
            length = 20;
        }
        ArrayList<KanzaModel> kanzaModels = kanzaService.getTestProblems(levels, length);
        ArrayList<KanzaDto> kanzaDtos = redisService.redisGetNCache(userModel.getUserIndex().toString(), 20 - length);
        log.info(String.valueOf(kanzaModels.size()));
        KanzaUniteDtos.TestProblems testProblems = KanzaUniteDtos.TestProblems.builder().build();

        testProblems.setTestLevel(levels);
        testProblems.setDays(days);
        testProblems.setLength(length);

        ArrayList<KanzaUniteDtos.Problem> problems = new ArrayList<>();

        for (KanzaDto kanzaDto : kanzaDtos) {
            KanzaModel kanzaModel = kanzaService.findByKANZA(kanzaDto.getKANZA());
            KanzaUniteDtos.Problem problem = kanzaService.returnProblemDto(kanzaModel, 1, levels);
            problem.setKanzaLetter(kanzaDto.getKANZA());
            problem.setKanzaMean(kanzaDto.getMEAN());
            problem.setKanzaSound(kanzaDto.getSOUND());
            problem.setProblemIndex(problems.size());
            problems.add(problem);
        }

        // 캐시로 받은 문제들을 어떻게 할지를 고민 일단 리스트에 전부 합칠건데 이 로직을 분리하는게 나을듯
        kanzaModels.forEach(x -> {
            KanzaUniteDtos.Problem problem = kanzaService.returnProblemDto(x, 0, levels);
            problem.setProblemIndex(problems.size());
            problem.setKanzaLetter(x.getKanzaLetter());
            problem.setKanzaMean(x.getKanzaMean());
            problem.setKanzaSound(x.getKanzaSound());
            problem.setProblemIndex(problems.size());
            problems.add(problem);
        });

        // 렌덤으로 섞는것 추가
        Collections.shuffle(problems);
        testProblems.setProblems(problems);

        redisService.createNewTestSession(userModel.getUserKakaoSerial(), days, levels, testProblems);
        return ResponseEntity.ok().body(testProblems);
    }

}