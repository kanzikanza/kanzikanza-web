package com.example.restservice.neo4j.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.neo4j.dto.KandleInitDataDtos;
import com.example.restservice.neo4j.dto.KandleInitDataDtos.KandleSessionRequest;
import com.example.restservice.neo4j.dto.KandleApiRequests;
import com.example.restservice.neo4j.dto.KandleApiResponses.KandleUpdateApiResponse;
import com.example.restservice.neo4j.service.KandleGeneratorService;
import com.example.restservice.neo4j.service.KandleRedisService;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
// import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RestController
@RequestMapping("kandle")
@RequiredArgsConstructor
public class KandleController {
    private final KandleGeneratorService kandleGeneratorService;
    private final KandleRedisService kandleRedisService;

    // TODO Scheduler로 매일 실행하게하기
    @GetMapping("/generate")
    public ResponseEntity<?> getMethodName() {
        try {

            String uuid = UUID.randomUUID().toString();
            log.info("KANDLE GENERATE 0");
            return ResponseEntity.ok().body(kandleGeneratorService.createKandle(uuid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/testCookies")
    public ResponseEntity<?> getCookieForTest() {
        String cookieString = "randomrandomm";
        ResponseCookie cookie = ResponseCookie.from("refreshToken", cookieString)
                .httpOnly(true)
                .path("/")
                .maxAge(3600)
                .build();

        // 쿠키를 만들고 또 이렇게하는 이유가 뭘까? 애초에 response는 전달하지 않는데 왜 addCookie를 하라는거지?
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body("Success");
    }

    @GetMapping("/newKandleSession")
    public ResponseEntity<?> createNewSession(@CookieValue String refreshToken) {
        // kandleGeneratorService.getCurrentKandle();
        try {
            // 오늘의 세션찾기
            // sortedSet 등써서 구해오기? 근데 굳이 영구일 필요가 없는데 영구여도 굳이 redis에 둘이유는 하나도 없지.
            // 리프레시 토큰으로 쿠키가 들어왔다는걸 가정하고 한다.

            KandleInitDataDtos.KandleSessionResponse response = kandleRedisService.createInitSession(refreshToken);
            if (response == null) {
                throw new Exception("Fail to create userSession");
            }

            // CurrentModel을 가져와서 세션줘야지.
            // 애초에 create말고 initNewSession으로 하는게 낫지않을까?

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/submitKandle")
    public ResponseEntity<?> submitKandle(
            @RequestBody KandleApiRequests apiRequests,
            @CookieValue String refreshToken) {

        try {
            Integer userResponseCount = kandleRedisService.getUserSessionResponsesCount(refreshToken);
            if (userResponseCount == null) {
                throw new Exception("Invalid Responses");
            }
            System.out.println(apiRequests.getSubmit());
            System.out.println(apiRequests.getSubmit());
            System.out.println(apiRequests.getSubmit());
            List<KandleInitDataDtos.KandleKanzaResponse> kandleKanzaResponses = (userResponseCount == 6 ? null
                    : kandleRedisService.submitNewResponse(refreshToken, apiRequests.getSubmit()));

            if (userResponseCount != 6 && kandleKanzaResponses == null)
                throw new Exception("Update data is null");

            String answer = userResponseCount == 5 ? kandleRedisService.getKandleSessionAnswer() : null;

            return ResponseEntity
                    .status(HttpStatus.ACCEPTED).body(
                            KandleUpdateApiResponse.builder()
                                    .kandleKanzaResponses(kandleKanzaResponses)
                                    .position(userResponseCount)
                                    .answer(answer).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }
}
