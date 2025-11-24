'use client';

import { style } from '@vanilla-extract/css';
import { useRef, useEffect, useState } from "react";

// import * as StompJs from "@stomp/stompjs";

import api from '@/lib/api'
import CongratulationModal from '../../component/Modal/CongratulationModal';
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

// Styled components removed - using Tailwind classes
// 테스트 페이지 컴포넌트
function ExamPage() {
  // 상태 변수 선언
  const [kanzas, setKanzas] = useState<kanza[]>([])
  const [index, setIndex] = useState<number>(0)
  const [inputValue, setInputValue] = useState("")
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [isInputValid, setIsInputValid] = useState<boolean>(true)
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP

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
  // 이런거 쓰면 안된다
  useEffect(() => {

    const fetchData = async (url: string, isToken: boolean) => {
      try {
        await api.get(url,
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




    fetchData(NEXT_PUBLIC_SERVER_IP + '/kanzi/problem', true);
    fetchData(NEXT_PUBLIC_SERVER_IP + '/kanzi/getTestProblems?levels=1&days=1', false);
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
        <div className="min-w-[768px] mx-auto max-w-full items-center grid grid-cols-2 md:flex-col">

          {/* 한자 등장 */}
            <div 
              className="h-[500px] flex m-0 flex-row justify-center items-center text-[#3e3e3e] relative"
            >
            {kanzas.length > 0 ? (
                <h1 className="text-[20rem] absolute top-[10%] left-1/2 -translate-x-1/2">{kanzas[index].kanza}</h1>
              ) : null}
              {problemReaction === true ? (<h6
                className={`text-5xl bg-[#FFEECE] w-80 text-center absolute bottom-[10%] left-1/2 -translate-x-1/2 ${
                  ((QuestionType.current && inputValue === kanzas[index].mean) ||
                    (!QuestionType.current && inputValue === kanzas[index].sound))
                    ? 'text-[#4caf50]'
                    : 'text-[#ff1744]'
                }`}>{kanzas[index].mean} {kanzas[index].sound}</h6>) : null}
          </div>


          {/* 그외 */}
          <div className="h-[500px] flex w-full m-0 flex-col justify-center items-start text-[#3e3e3e]">
            <h4 className="text-3xl">다음 한자의 {QuestionType.current ? '뜻' : '음'}을 적으시오</h4>
            <br /><br />
            {/* 진행 상황 */}
            <h3 className="text-5xl">
              {progress}%
            </h3>

            {/* <form onSubmit={handleSubmit}> */}
            <div className="h-[100px] flex w-full items-center">
              <div className="max-w-[500px] w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <input
                  id="message"
                  placeholder="입력창"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setIsInputValid(true) // 입력이 변경되면 경고 메시지를 숨김
                  }}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-12 py-3 border ${!isInputValid ? 'border-red-500' : 'border-orange-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <button 
                  type="submit"
                  onClick={handleSubmit}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 transition-colors"
                >
                  제출
                </button>
                {!isInputValid && <p className="text-red-500 text-sm mt-1">입력값이 필요합니다.</p>}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamPage

