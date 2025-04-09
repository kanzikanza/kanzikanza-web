'use client';

import { style } from '@vanilla-extract/css';
import { useRef, useEffect, useState } from "react";
import { Button, Grid, Typography, styled, TextField, InputAdornment, LinearProgress } from '@mui/material/';
import { Edit } from '@mui/icons-material'
import * as StompJs from "@stomp/stompjs";
import CongratulationModal from '../../component/Modal/CongratulationModal';
import axios, { AxiosResponse } from 'axios';
import SmallButton from '../../component/Button/SmallButton';

// 타입 정의
type kanza = {
  kanza: string;
  mean: string;
  sound: string;
}

type reviewsProblem = {
  kanza: kanza;
  isRight: boolean;
  answer : number | string
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
  width: 100%;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #3e3e3e;
`

const InputForm = styled('div')`
  height: 100px;
  display: flex;
  width: 100%;
  align-items: center;
`
const InputText = styled(TextField)`
  max-width : 500px;
  width: 100%;
`
// 테스트 페이지 컴포넌트
function ExamPage() {
  // 상태 변수 선언
  const [kanzas, setKanzas] = useState<kanza[]>([])
  const [index, setIndex] = useState<number>(0)
  const [inputValue, setInputValue] = useState("")
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [isInputValid, setIsInputValid] = useState<boolean>(true)
  const SERVER_IP = process.env.SERVER_IP

  // progress 관련
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [progress, setProgress] = useState<number>(0);

  // useRef를 사용하여 값이 바뀌어도 리렌더링이 일어나지 않도록 설정
  const HowMany = useRef<number>(0);
  const [count, setCount] = useState<number>(0);
  const [problemReaction, setProblemReaction] = useState<boolean>(false);
  const QuestionType = useRef<number>(0);

  const Cs = useRef<boolean>(true); 
  const inputRef = useRef<any>(null);

  // 다 맞혀서 축하하는 모달을 표시할지 여부를 저장하는 state
  const [showCongratulationModal, setShowCongratulationModal] = useState<boolean>(false);
  const [score, setScore] = useState<Number>(-1);
  const ReviewProblem = useRef<reviewsProblem[]>([])

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
  const handleKeyDown = (event : any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (Cs.current === false)
      {
        return
      }
      if (event.nativeEvent.isComposing) {
        handleSubmit(event);
        Cs.current = false
      }
      else
      {
        setInputValue("");
      }
    }
  };

  // 제출 이벤트 핸들러
  const handleSubmit = (event : any) => {
    event.preventDefault();

    // 입력값이 비어있는 경우 경고 메시지 표시
    if (!inputValue.trim()) {
      setIsInputValid(false);
      return;
    }

    // 입력값이 있는 경우 경고 메시지 숨김
    setIsInputValid(true)
    if (inputRef.current !== null) 
    {
      inputRef.current.blur(); // 포커스 해제
    }

    console.log("Submitted:", inputValue);

    let tmp: reviewsProblem = { kanza: kanzas[count], answer: inputValue, isRight: true }
    console.log(QuestionType.current)
    if (QuestionType.current) {
      console.log(inputValue, kanzas[index].mean)

      if (inputValue === kanzas[index].mean) {
        HowMany.current = HowMany.current + 10
      }
      else
      {
        tmp.isRight = false
      }
    } else {
      console.log(inputValue, kanzas[index].sound)

      if (inputValue === kanzas[index].sound) {
        HowMany.current = HowMany.current + 10
        console.log(HowMany.current)
      }
      else
      {
        tmp.isRight = false  
      }
    }
    QuestionType.current = getRandomInt(0, 2);
    ReviewProblem.current.push(tmp)
    setProblemReaction(true)

    setTimeout(() => { 
      setProblemReaction(false)
      setIndex((prev) => prev + 1);
      setCount(count + 1)
      setInputValue("");
    }, 1000)
  };

  useEffect(() => {
    // 제출할 때마다 진행 상황을 업데이트
    setProgress((count / totalQuestions) * 100);
    console.log(`진행상황: ${progress}`);
    Cs.current = true;
  }, [count, totalQuestions, progress]);


  useEffect(() => {
    // 총 문제 수가 10이고, 현재 문제 번호가 0부터 시작하므로, 
    // 10문제까지 완료하면 100%가 되도록 설정
    if (index >= totalQuestions) {
      setProgress(100);
      setIsEnd(true);
      setTimeout(() => {
        setScore(HowMany.current)
      }, 1000)
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

    const fetchData = async (url: string, isToken: boolean) => {
      try {
        await axios.get(url,
          {
            // headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
          }
        ).then((answer) => { 
          console.log(`Get Success : ${url}`)
          console.log(answer)
          // console.log(answer.data[1].data[1])
          // response = answer.data[1].data[1]
        })
        .catch((error) => { 
          console.log(error)
          
        });
        let response : any[] = []
        if (!response)
        {
          throw "response doesn't have val"
        }
        // console.log(response);
        response = response.map((x) => x[1])
        setKanzas(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };




    fetchData(SERVER_IP + '/kanzi/problem', true);
    fetchData(SERVER_IP + '/kanzi/getTestProblems?levels=1&days=1', false);
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
          {/* <CongratulationModal open={showCongratulationModal} onClose={handleCloseCongratulationModal} score={score} /> */}
        </div>
      ) : (
        <GridContainer container>

          {/* 한자 등장 */}
            <KanjiGrid item xs={5}
              style={{
                position: 'relative', // 자식 요소의 위치를 부모 기준으로 설정
                // height: '100%', // 부모 높이를 고정
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // 가로 중앙 정렬


              }}
            >
            {kanzas.length > 0 ? (
                <Typography variant='h1' style={{
                  fontSize: '20rem',
                  position: 'absolute', // 고정된 위치
                  top: '10%', // 부모의 10% 높이에 고정
                  left: '50%', // 가로 중앙 정렬
                  transform: 'translateX(-50%)', // 정확히 중앙으로 이동

               }}>{kanzas[index].kanza}</Typography>
              ) : null}
              {problemReaction === true ? (<Typography variant='h6'
                style={{
                  fontSize: '3rem',
                  backgroundColor: '#FFEECE',
                  color: ((QuestionType.current && inputValue === kanzas[index].mean) ||
                    (!QuestionType.current && inputValue === kanzas[index].sound))
                    ? '#4caf50'
                    : '#ff1744', width: '20rem',
                  textAlign: 'center',
                  position: 'absolute', // 부모 기준으로 배치
                  bottom: '10%', // 부모의 아래쪽에 고정
                  left: '50%', // 가로 중앙 정렬
                  transform: 'translateX(-50%)', // 정확히 중앙으로 이동
                }}>{kanzas[index].mean} {kanzas[index].sound}</Typography>) : null}
          </KanjiGrid>


          {/* 그외 */}
          <InputGrid item xs={5}>
            <Typography variant='h4'>다음 한자의 {QuestionType.current ? '뜻' : '음'}을 적으시오</Typography>
            <br /><br />
            {/* 진행 상황 */}
            <Typography variant='h3'>
              {progress}%
            </Typography>

            {/* <InputForm onSubmit={handleSubmit}> */}
            <InputForm>
              <InputText
                id="message"
                placeholder="입력창"
                multiline
                ref={inputRef}
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

