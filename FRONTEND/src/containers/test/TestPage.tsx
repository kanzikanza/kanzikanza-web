'use client'
import React, { useState, useEffect, useRef } from 'react';
import  close   from '@/assets/test/Close.png'
import  done   from '@/assets/test/Done.png'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from "next/image"
// MUI removed
import axios, { AxiosResponse } from 'axios';
import withInitialization from '@/global/globalComponent';
import CongratulationModal from '@/component/Modal/CongratulationModal';
import { apiDecoder } from '@/global/GlobalApiDecoder';
import api from '@/lib/api';

// Styled components removed - using Tailwind classes

export type kanza = {
  kanza: string;
  mean: string;
  sound: string;
}
export type reviewsProblem = {
  kanza: kanza;
  isRight: boolean;
  answer : number | string
}

const TestPage = ({ url } : { url : string}) => {
    const [questionList, setQuestionList] = useState<any[]>([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [showCongratulationModal, setShowCongratulationModal] = useState<boolean>(false);
    const [correctAnswer, setCorrectAnswer] = useState(-1);
    const [selectedAnswer, setSelectedAnswer] = useState(-1);
    const [problemIndex, setProblemIndex] = useState<number>(-1);
    const [problemType, setProblemType] = useState<number>(-1);
    const [isEnd, setIsEnd] = useState<boolean>(false)
    const [score, setScore] = useState<Number>(-1);
    const HowMany = useRef<number>(0);
    const ReviewProblem = useRef<kanza[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const levels : number = Number(searchParams.get('levels'))
    const days : number = Number( searchParams.get('days'))
    const decoder = new apiDecoder();
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    const isNavigating = useRef(false);


    const handleCloseCongratulationModal = () => {
        setShowCongratulationModal(false);
        // router.push('/test')
        router.push('/')
    };
    if (levels === null || days === null)
    {
        router.push('/')
    }

    const handleAnswerSelect = (answer: any) => {
        // 이미 답을 선택한 경우 중복 클릭 방지
        if (selectedAnswer !== -1) return;
        
        setSelectedAnswer(answer)
        console.log(answer, correctAnswer)
        const buttons = document.querySelectorAll('.answer-button');


        api.post(
            NEXT_PUBLIC_SERVER_IP + "/kanzi/updateTestProgress",
            {
                type: "KanzaUniteDtos$TestUpdateDate",
                kanzaIndex: questionList[problemIndex][1]['kanzaIndex'],
                problemIndex: answer === correctAnswer ? - 1 : problemIndex,
                length: 20,
                testLevel: levels,
                days : days
            },
        ).then(() => { })
        .catch((error) => {console.error(error)})


        buttons.forEach((button, index) => {
            if (index === answer) {
                if (answer === correctAnswer) {
                    button.classList.add('correct');
                    HowMany.current += 5
                } else {
                    button.classList.add('wrong');
                    ReviewProblem.current.push(
                        {
                            kanza: questionList[problemIndex][1]['kanzaLetter'],
                            mean: questionList[problemIndex][1]['kanzaMean'],
                            sound: questionList[problemIndex][1]['kanzaSound']
                        }
                    )
                    buttons.forEach((b, indexT) => {
                        if (indexT === correctAnswer) {
                            b.classList.add('correct');
                        }
                    });
                }
            }
            button.classList.add('reveal');
            setTimeout(() => { 
                const buttons = document.querySelectorAll('.answer-button');
                buttons.forEach((button, index) => {
                    button.classList.remove('reveal');
                    button.classList.remove('correct');
                    button.classList.remove('wrong');
                    setSelectedAnswer(-1)
                    setProblemIndex(problemIndex + 1)
                })
            }, 1000)
        });
    };
    
    useEffect(() => {
        console.log(url, "determine url")
        const fetchData = async (url: string, isToken: boolean) => {
            try {
                await api.get(url,
                ).then((answer) => {
                    console.log(answer.data)
                    const [testData, metaData] = decoder.decodeTestProblems(answer.data)
                    // console.log(answer.data[1]['problems'][1])
                    setQuestionList(testData.problems[1])
                    setProblemIndex(metaData.progress)
                })
                .catch((error) => {
                    console.log(error)
                });
                let response: any[] = []
                if (!response ) {
                    throw "response doesn't have val"
                }
                // console.log(response);
                response = response.map((x) => x[1])
                // setKanzas(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData(url, false);
    }, []);
    
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const message = "BeforeUnload 테스트가 진행중입니다. 페이지를 나가시겠습니까? ";
            e.returnValue = message;
            return message;
        };

        const handleClick = (e: MouseEvent) => {
            if (isNavigating.current) return;
            
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.href && !anchor.href.includes(pathname)) {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm("테스트가 진행중입니다. 페이지를 나가시겠습니까? ") == false) {
                    return;
                }
                isNavigating.current = true;
                window.location.href = anchor.href;
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (isNavigating.current) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            if (window.confirm("PopState 테스트가 진행중입니다. 페이지를 나가시겠습니까? ") == true) {
                isNavigating.current = true;
                window.history.back();
            } else {
                // 현재 상태를 유지하면서 히스토리 스택을 조작
                const currentState = window.history.state;
                window.history.replaceState(currentState, '', url);
                window.history.pushState(currentState, '', url);
            }
        };

        // 초기 상태 설정
        const initialState = { from: url };
        // window.history.replaceState(initialState, '', url);
        // window.history.pushState(initialState, '', url);

        window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
        document.addEventListener('click', handleClick, { capture: true });
        window.addEventListener('popstate', handlePopState, { capture: true });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
            document.removeEventListener('click', handleClick, { capture: true });
            window.removeEventListener('popstate', handlePopState, { capture: true });
        };
    }, [pathname]);

    // 함수의 시작은 여기서부터임 


    useEffect(() => {
        if (problemIndex == -1) return

        if (problemIndex >= 20)
        {
            router.push(
                `/test/result?levels=${levels}&days=${days}`,
            )
            setIsEnd(true)
            setTimeout(() => {
                setScore(HowMany.current)
                setShowCongratulationModal(true);
            }, 1000)
            return
        }
        // console.warn(`current length ${options.length}, and ${questionList[problemIndex][1]['options'][1]}`)
        setQuestion(questionList[problemIndex][1]['problemContent'])
        setCorrectAnswer(questionList[problemIndex][1]['answer'])
        setOptions([questionList[problemIndex][1]['options'][1][0], questionList[problemIndex][1]['options'][1][1] , questionList[problemIndex][1]['options'][1][2], questionList[problemIndex][1]['options'][1][3]])
        setProblemType(questionList[problemIndex][1]['problemType'])

    }, [problemIndex, questionList])
    
    return (
        <div className='topContainter w-[50rem] h-full min-h-[30rem] py-4 mx-auto'>
            
            {isEnd ? 
                <>
                </> :
                <div className="w-full">
                    <div className="h-6 rounded-lg bg-[#FFE4E1] mb-8 overflow-hidden">
                        <div 
                            className="h-full bg-[#FFB6C1] transition-all duration-300"
                            style={{ width: `${problemIndex / questionList.length * 100}%` }}
                        />
                    </div>
                    <hr className="border-t border-gray-300 mb-4" />

                    <h6 className="my-6 text-left text-[2rem] font-medium">
                        다음 한자의 {problemType == 0 ? '문자를' : problemType == 1 ? "뜻을" : "음을"} 선택하시오.
                    </h6>
                    <div className="flex flex-row gap-6">
                        <div className="flex-[0_0_66.666%]">
                            <div className="w-[30rem] h-[30rem] mx-auto flex items-center justify-center mb-6 rounded-2xl border border-[#D2D2D2] bg-white shadow-md">
                                <span className={`${problemType ? 'text-[15rem]' : 'text-[5rem]'}`}>{question}</span>
                            </div>
                        </div>
                        <div className="flex-[0_0_33.333%]">
                            <div className="flex flex-col gap-4">
                                {options
                                    .filter(option => option !== undefined && option !== null && option !== '')
                                    .map((option, index) => (
                                                <div
                                                    className="w-[15rem] rounded-2xl shadow-md bg-white"
                                                    key={option}
                                                >
                                                    <button
                                                        onClick={() => handleAnswerSelect(index)}
                                                        className="answer-button w-full h-[6.75rem] transition-all duration-300 text-[2rem] text-black rounded-2xl border border-[#D2D2D2] hover:bg-[#FFE5C6] hover:border-[#d2d2d2] [&.correct]:bg-[#90EE90] [&.correct]:border-[#90EE90] [&.wrong]:bg-[#FF6B6B] [&.wrong]:border-[#FF6B6B] [&.reveal]:pointer-events-none relative"
                                                    >
                                                        {/* 상태에 따른 아이콘 애니메이션 */}
                                                        <div className={`absolute left-8 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 ${
                                                            (correctAnswer === index) && selectedAnswer != -1 ? 'opacity-100' :
                                                                (selectedAnswer === index) && selectedAnswer != correctAnswer ? 'opacity-100' : ''
                                                        }`}>
                                                            {correctAnswer === index && selectedAnswer != -1 && (
                                                                <Image
                                                                    src={done}
                                                                    alt="정답"
                                                                    priority
                                                                    style={{ width: '2rem', height: '2rem' }}
                                                                />
                                                            )}
                                                            {selectedAnswer === index && selectedAnswer != correctAnswer && (
                                                                <Image
                                                                    src={close}
                                                                    alt="오답"
                                                                    style={{ width: '2rem', height: '2rem' }}
                                                                    priority
                                                                />
                                                            )}
                                                        </div>
                                            <div
                                                className={`relative transition-[margin-left] duration-300 ${
                                                    (correctAnswer === index && selectedAnswer !== -1) ||
                                                        (selectedAnswer === index && selectedAnswer !== correctAnswer)
                                                        ? 'ml-8'
                                                        : ''
                                                }`}
                                            >
                                                {option}
                                            </div>
                                        </button>
                                    </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
    </div>
    
    );
};



// export default withInitialization(TestPage) // <= 여기다 뭐 넣기
export default TestPage // <= 여기다 뭐 넣기