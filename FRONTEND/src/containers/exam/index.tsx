'use client';

import { style } from '@vanilla-extract/css';
import { useRef, useEffect, useState } from "react";
import { Button, Grid, Typography, styled, TextField, InputAdornment, LinearProgress } from '@mui/material/';
import { Edit } from '@mui/icons-material'
import * as StompJs from "@stomp/stompjs";
import axios from 'axios';
import SmallButton from '../../components/Button/SmallButton';

// 타입 정의
type kanza = {
  kanza: string;
  mean: string;
  sound: string;
}

const GridContainer = styled(Grid)`
  min-width: 768px;
  margin: 0 auto;
  max-width: 100%;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const KanjiGrid = styled(Grid)`
  height: 500px;
  display: flex;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #3e3e3e;
`

const InputGrid = styled(Grid)`
  height: 500px;
  display: flex;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #3e3e3e;
`

const InputForm = styled('form')`
  height: 100px;
  display: flex;
  align-items: center;
`
const InputText = styled(TextField)`
  width: 500px;
`

// 테스트 페이지 컴포넌트
function ExamPage() {
  // 상태 변수 선언
  const [kanzas, setKanzas] = useState<kanza[]>([])
  const [index, setIndex] = useState<number>(0)
  const [inputValue, setInputValue] = useState("")
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [isInputValid, setIsInputValid] = useState<boolean>(true)

  // progress 관련
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [progress, setProgress] = useState<number>(0);

  // useRef를 사용하여 값이 바뀌어도 리렌더링이 일어나지 않도록 설정
  // const HowMany = useRef<number>(0);
  const [count, setCount] = useState<number>(0);
  const QuestionType = useRef<number>(0);

  // 다 맞혀서 축하하는 모달을 표시할지 여부를 저장하는 state
  const [showCongratulationModal, setShowCongratulationModal] = useState<boolean>(false);

  // 10문제 다 맞혔을 때 호출되는 함수
  const handleCorrectAnswers = () => {
    setShowCongratulationModal(true);
  };

  // 모달을 닫을 때 호출되는 함수
  const handleCloseCongratulationModal = () => {
    setShowCongratulationModal(false);
    // router.push('/test')
    window.location.reload();
  };

  // 엔터 키 다운 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  // 제출 이벤트 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();

    // 입력값이 비어있는 경우 경고 메시지 표시
    if (!inputValue.trim()) {
      setIsInputValid(false);
      return;
    }

    // 입력값이 있는 경우 경고 메시지 숨김
    setIsInputValid(true)

    console.log("Submitted:", inputValue);

    if (!QuestionType.current) {
      if (inputValue === kanzas[index].mean) {
        // setHowMany(howMany+1);
      }
      setIndex((prev) => prev + 1);
    } else {
      if (inputValue === kanzas[index].sound) {
        // setHowMany(howMany + 1);
      }
      setIndex((prev) => prev + 1);
    }
    QuestionType.current = getRandomInt(0, 2);
    setInputValue("");

    setCount(count+1)
  };

  useEffect(() => {
    // 제출할 때마다 진행 상황을 업데이트
    setProgress((count / totalQuestions) * 100);
    console.log(`진행상황: ${progress}`);
  }, [count, totalQuestions, progress]);


  useEffect(() => {
    // 총 문제 수가 10이고, 현재 문제 번호가 0부터 시작하므로, 
    // 10문제까지 완료하면 100%가 되도록 설정
    if (index >= totalQuestions) {
      setProgress(100);
      setIsEnd(true);

      // 여기에 추가: 10문제 다 맞췄을 때 모달 띄우기
      if (count === totalQuestions) {
        setShowCongratulationModal(true);
      }
    }
  }, [index, totalQuestions, count]);

  // 랜덤 정수 반환 함수
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 데이터 불러오기 효과적으로 처리하는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/kanzi/problem');
        console.log(response.data.data);
        setKanzas(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 열 문제 다 맞히면 정답 현황 알려주는 모달 등장 
  const fullAnswer = styled('div')`
    
  `

  // // 다음 문제로 넘어가기
  // function goNext() {
  //   setIndex((prev) => prev + 1);
  // }

  return (
    // JSX로 화면 렌더링
    <div>
      {/* 다 맞혀서 축하하는 모달 */}
      {/* <CongratulationModal open={showCongratulationModal} onClose={handleCloseCongratulationModal} /> */}
      {isEnd ? (
        <div>
          <CongratulationModal open={showCongratulationModal} onClose={handleCloseCongratulationModal} />
        </div>
      ) : (
        <GridContainer container>

          {/* 한자 등장 */}
          <KanjiGrid item xs={5}>
            {kanzas.length > 0 ? (
              <Typography variant='h1' style={{ fontSize: '20rem' }}>{kanzas[index].kanza}</Typography>
            ) : null}
          </KanjiGrid>


          {/* 그외 */}
          <InputGrid item xs={5}>
            <Typography variant='h4'>다음 한자의 {QuestionType.current ? '뜻' : '음'}을 적으시오</Typography>
            <br /><br />
            {/* 진행 상황 */}
            <Typography variant='h3'>
              {progress}%
            </Typography>

            <InputForm onSubmit={handleSubmit}>
              <InputText
                id="message"
                placeholder="입력창"
                multiline
                color="warning"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setIsInputValid(true) // 입력이 변경되면 경고 메시지를 숨김
                }}
                onKeyDown={handleKeyDown}
                error={!isInputValid}
                helperText={!isInputValid ? "입력값이 필요합니다." : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Edit />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button 
                        type="submit"
                        color="warning"
                      >
                        제출
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              
            </InputForm>
          </InputGrid>
        </GridContainer>
      )}
    </div>
  );
}

export default ExamPage

