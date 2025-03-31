package com.example.restservice.kanza.service;

import com.example.restservice.dtos.KanzaUniteDtos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.restservice.kanza.persistence.KanzaRepository;
import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
// import org.hibernate.mapping.List;

import com.example.restservice.kanza.model.KanzaModel;

@Slf4j
@Service
@RequiredArgsConstructor
public class KanzaService {
    private final KanzaRepository kanzaRepository;

    public String kanziservice(String kanzi, String mean, String sound) {
        KanzaModel kanzikanza = KanzaModel.builder().kanzaLetter(kanzi)
                .kanzaMean(mean)
                .kanzaSound(sound).build();
        kanzaRepository.save(kanzikanza);

        KanzaModel returnValue = kanzaRepository.findById(kanzikanza.getKanzaIndex()).get();
        return returnValue.getKanzaLetter();
    }

    public List<KanzaModel> create(final KanzaModel kanza) {

        validate(kanza);

        System.out.println(kanzaRepository.findByKanzaLetter(kanza.getKanzaLetter()));
        if (kanzaRepository.findByKanzaLetter(kanza.getKanzaMean()) == null) {
            kanzaRepository.save(kanza);
            log.info("한자가 저장되었음", kanza.getKanzaIndex());
        }
        // return kanzaRepository.findById(kanza.getId());
        return kanzaRepository.findByKanzaSound(kanza.getKanzaSound());
    }

    public KanzaModel findByKanzaIndex(Integer kanzaIndex) {
        return kanzaRepository.findByKanzaIndex(kanzaIndex);
    }

    public List<KanzaModel> getAllofThem() {
        return kanzaRepository.findAll();
    }

    public List<KanzaModel> getTOP20() {
        return kanzaRepository.findKanzasByRandom(20);
    }

    private void validate(final KanzaModel kanza) {
        if (kanza == null) {
            log.warn("추가될 수가 없음");
            throw new RuntimeJsonMappingException("kanza cannot be null");
        }
    }

    public KanzaModel findByKANZA(String KANZA) {
        return kanzaRepository.findByKanzaLetter(KANZA);
    }

    public List<KanzaModel> getTestProblems(Integer level, Integer length) {
        // 다행히 급수와 레벨은 거의 같기 떄문에 그것만 맞춰서 해주면됨
        return kanzaRepository.findKanzaModelsByLevel(length, level);
    }

    public KanzaModel findRelatedKanza(Integer kanzaIndex) {
        // 1단계 구현 인덱스가 비슷한 한자
        Integer minIndex = kanzaRepository.findMinKanzaIndex();
        Integer maxIndex = kanzaRepository.findMaxKanzaIndex();
        Random random = new Random();
        while (true) {
            int nextIndex = kanzaIndex + random.nextInt(100) - 50;
            if (nextIndex < minIndex || nextIndex > maxIndex) {
                continue;
            }
            return kanzaRepository.findByKanzaIndex(nextIndex);
        }
        // 이런 쓰레기를 만들었다는게 믿기지 않음
    }

    public List<KanzaModel> findWrongMeanKanzaModel(Integer level, String keyFactor) {

        return kanzaRepository.findWrongKanzaMeanModelsByLevel(level, keyFactor);
    }

    public List<KanzaModel> findWrongSoundKanzaModel(Integer level, String keyFactor) {

        return kanzaRepository.findWrongKanzaSoundModelsByLevel(level, keyFactor);
    }

    public List<KanzaModel> findWrongLetterKanzaModel(Integer level, String keyFactor) {

        return kanzaRepository.findWrongKanzaLetterModelsByLevel(level, keyFactor);
    }

    public KanzaUniteDtos.Problem returnProblemDto(KanzaModel kanzaModel, Integer isFromCache, Integer level) {
        Random random = new Random();

        // todo: 이후 전체 코드관리
        int availableProblemType = 3;
        int maxAnswerOption = 4;

        int problemType = random.nextInt(availableProblemType);
        int answerOption = random.nextInt(maxAnswerOption);

        KanzaUniteDtos.Problem problem = KanzaUniteDtos.Problem.builder()
                .problemType(problemType)
                .answer(answerOption)
                .kanzaIndex(kanzaModel.getKanzaIndex())
                .isFromCache(isFromCache)
                .build();
        List<String> options = new ArrayList<>();
        problem.setProblemIndex(kanzaModel.getKanzaIndex());

        if (problemType == 0) {
            problem.setProblemContent(kanzaModel.getKanzaMean() + " " + kanzaModel.getKanzaSound());
            List<KanzaModel> wrongAnswerKanzaLetter = findWrongLetterKanzaModel(level, kanzaModel.getKanzaLetter());
            for (KanzaModel wrongKanzaModel : wrongAnswerKanzaLetter) {
                options.add(wrongKanzaModel.getKanzaLetter());
            }
            options.add(answerOption, kanzaModel.getKanzaLetter());
        } else if (problemType == 1) {
            problem.setProblemContent(kanzaModel.getKanzaLetter());
            List<KanzaModel> wrongAnswerKanzaMean = findWrongMeanKanzaModel(level, kanzaModel.getKanzaMean());
            for (KanzaModel wrongKanzaModel : wrongAnswerKanzaMean) {
                options.add(wrongKanzaModel.getKanzaMean());
            }
            options.add(answerOption, kanzaModel.getKanzaMean());
        } else if (problemType == 2) {
            problem.setProblemContent(kanzaModel.getKanzaLetter());
            List<KanzaModel> wrongAnswerKanzaSound = findWrongSoundKanzaModel(level, kanzaModel.getKanzaSound());
            for (KanzaModel wrongKanzaModel : wrongAnswerKanzaSound) {
                options.add(wrongKanzaModel.getKanzaSound());
            }
            options.add(answerOption, kanzaModel.getKanzaSound());
        }
        problem.setOptions(options);
        return problem;
    };

}
