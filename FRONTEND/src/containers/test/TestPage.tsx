'use client'
import React, { useState, useEffect, useRef } from 'react';
import  close   from '@/assets/test/Close.png'
import  done   from '@/assets/test/Done.png'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from "next/image"
import { 
  Box, 
  Container, 
  LinearProgress, 
  Button, 
  Paper,
  Divider,
  Typography,
  Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios, { AxiosResponse } from 'axios';
import withInitialization from '@/global/globalComponent';
import CongratulationModal from '@/component/Modal/CongratulationModal';
import { apiDecoder } from '@/global/GlobalApiDecoder';

const TextWrapper = styled('div')({
  position: 'relative',
  transition: 'margin-left 0.3s ease',
  '&.has-icon': {
    marginLeft: '2rem' // 아이콘 너비만큼 이동
  }
});

const StatusIcon = styled('div')({
  position: 'absolute',
  left: '2rem', // 글자 왼쪽에 위치
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  transition: 'all 0.3s ease',
  '&.visible': {
    opacity: 1,
    left: '2rem' // 최종 위치 조정
  }
});

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
        setSelectedAnswer(answer)
        console.log(answer, correctAnswer)
        const buttons = document.querySelectorAll('.MuiButton-root');


        axios.post(
            NEXT_PUBLIC_SERVER_IP + "/kanzi/updateTestProgress",
            {
                type: "KanzaUniteDtos$TestUpdateDate",
                kanzaIndex: questionList[problemIndex][1]['kanzaIndex'],
                problemIndex: answer === correctAnswer ? - 1 : problemIndex,
                length: 20,
                testLevel: levels,
                days : days
            },
            {
                headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
            }
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
                const buttons = document.querySelectorAll('.MuiButton-root');
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
                await axios.get(url,
                {
                    headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                }
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
                if (window.confirm("Click 테스트가 진행중입니다. 페이지를 나가시겠습니까? ") == false) {
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
        <Container className='topContainter' sx={{ width: '50rem', height: '100%', minHeight: '30rem', paddingY: '1rem', margin: 'auto' }}>
            
            {isEnd ? 
                <>
                </> :
                <Box sx={{ width: '100%', }}>
                    <LinearProgress
                        variant="determinate"
                        value={problemIndex / questionList.length * 100}
                        sx={{
                            height: '1.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#FFE4E1',
                            marginBottom: '2rem',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#FFB6C1'
                            }
                        }}
                    />
                    <Divider />

                    <Typography variant="h6" sx={{ my: 3, textAlign: 'left', fontSize: '2rem' }}>
                        다음 한자의 {problemType == 0 ? '문자를' : problemType == 1 ? "뜻을" : "음을"} 선택하시오.
                    </Typography>
                    <Grid
                        container
                        direction='row'
                        spacing={3}
                    >
                        <Grid item xs={8}>
                            <Paper
                                elevation={2}
                                sx={{
                                    width: '30rem',
                                    height: '30rem',
                                    margin: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 3,
                                    borderRadius: '1rem',
                                    borderColor: '#D2D2D2'
                                }}>
                                <Typography sx={{ fontSize: problemType ? "15rem" : "5rem" }}>{question}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container direction="column" sx={{ gap: '1rem' }}>
                                {options
                                    .filter(option => option !== undefined && option !== null && option !== '')
                                    .map((option, index) => (
                                                <Paper
                                                    sx={{ width: '15rem', borderRadius: '1rem' }}
                                                    key={option}
                                                    elevation={2}
                                                >
                                                    <AnswerButton
                                                        fullWidth
                                                        variant="outlined"
                                                        onClick={() => handleAnswerSelect(index)}
                                                        sx={{
                                                            height: '6.75rem',
                                                            transition: 'all 0.3s',
                                                            fontSize: '2rem',
                                                            '&.MuiButton-root:not(.correct):not(.wrong):not(.reveal):hover': {
                                                                backgroundColor: '#FFE5C6', // 회색 계열 호버
                                                                borderColor: '#d2d2d2'
                                                            },
                                                            '&.correct': {
                                                                backgroundColor: '#90EE90',
                                                                borderColor: '#90EE90',
                                                            },
                                                            '&.wrong': {
                                                                backgroundColor: '#FF6B6B',
                                                                borderColor: '#FF6B6B',
                                                            },
                                                            '&.reveal': {
                                                                pointerEvents: 'none',
                                                            }
                                                        }}
                                                    >
                                                        {/* 상태에 따른 아이콘 애니메이션 */}
                                                        <StatusIcon className={
                                                            (correctAnswer === index) && selectedAnswer != -1 ? 'visible' :
                                                                (selectedAnswer === index) && selectedAnswer != correctAnswer ? 'visible' : ''
                                                        }>
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
                                                        </StatusIcon>
                                            <TextWrapper
                                                className={
                                                    (correctAnswer === index && selectedAnswer !== -1) ||
                                                        (selectedAnswer === index && selectedAnswer !== correctAnswer)
                                                        ? 'has-icon'
                                                        : ''
                                                }
                                            >
                                                {option}
                                            </TextWrapper>
                                        </AnswerButton>
                                    </Paper>
                                    ))
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            }
    </Container>
    
    );
};

const AnswerButton = styled(Button)(({ theme }) => ({
    color: 'black',
    elevation: '2',
    borderRadius: '1rem',
    borderColor: '#D2D2D2',
    fontSize: '1.2rem',
    '&&:hover': {  // 특이성(specificity)을 높이기 위해 && 사용
    borderColor: '#D2D2D2',  // 기존 보더 색상 유지
    boxShadow: theme.shadows[2],  // 그림자 효과 유지
    }
}));



// export default withInitialization(TestPage) // <= 여기다 뭐 넣기
export default TestPage // <= 여기다 뭐 넣기