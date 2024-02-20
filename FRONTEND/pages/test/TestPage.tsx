// 필요한 모듈을 import 합니다.
import { style } from '@vanilla-extract/css';
import { useRef, useEffect, useState } from "react";
import { Button, Grid, Typography, styled, TextField, InputAdornment } from '@mui/material/';
import { Edit } from '@mui/icons-material'
import * as StompJs from "@stomp/stompjs";
import axios from 'axios';

// 타입 정의
type kanza = {
  kanza: string;
  mean: string;
  sound: string;
}

const KanjiGrid = styled(Grid)`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3e3e3e;
`

const InputGrid = styled(Grid)`
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #3e3e3e;
`

const InputForm = styled(TextField)`
  width: 500px;
`

// 테스트 페이지 컴포넌트
function TestPage() {
  // 상태 변수 선언
  const [kanzas, setKanzas] = useState<kanza[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [isEnd, setIsEnd] = useState<boolean>(false);

  // useRef를 사용하여 값이 바뀌어도 리렌더링이 일어나지 않도록 설정
  const HowMany = useRef<number>(0);
  const QuestionType = useRef<number>(0);

  // 엔터 키 다운 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  // 제출 이벤트 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submitted:", inputValue);

    if (!QuestionType.current) {
      if (inputValue === kanzas[index].mean) {
        HowMany.current += 1;
      }
      setIndex((prev) => prev + 1);
    } else {
      if (inputValue === kanzas[index].sound) {
        HowMany.current += 1;
      }
      setIndex((prev) => prev + 1);
    }
    QuestionType.current = getRandomInt(0, 2);
    setInputValue("");
  };

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

  // 다음 문제로 넘어가기
  function goNext() {
    setIndex((prev) => prev + 1);
  }

  return (
    // JSX로 화면 렌더링
    <div>
      {isEnd ? (
        <div>
          {/* 게임 종료 화면 */}
        </div>
      ) : (
        <Grid container>
          {/* 한자 등장 */}
          <KanjiGrid item xs={5}>
            {kanzas.length > 0 ? (
              <Typography variant='h1' style={{ fontSize: '20rem' }}>{kanzas[index].kanza}</Typography>
            ) : null}
          </KanjiGrid>

          <InputGrid item xs={5}>
              <Typography variant='h4'>다음 한자의 {QuestionType.current ? '뜻' : '음'}을 적으시오</Typography>
              <br /><br />
              <form className="w-full mx-auto" onSubmit={handleSubmit}>
                <InputForm
                  id="message"
                  placeholder="입력창"
                  multiline
                  color="warning"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                ></InputForm>
                
              </form>
          </InputGrid>
        </Grid>
      )}
    </div>
  );
}

export default TestPage;

