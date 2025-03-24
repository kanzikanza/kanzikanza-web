'use client'
import React, { useState, useEffect } from 'react';
// import { Close, Done } from '@mui/icons-material';
import  close   from '@/assets/test/Close.png'
import  done   from '@/assets/test/Done.png'
// import  from ../../global/globalFunction
// import 
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

const TextWrapper = styled('div')({
  position: 'relative',
  transition: 'margin-left 0.3s ease',
  '&.has-icon': {
    marginLeft: '2rem' // 아이콘 너비만큼 이동
  }
});
// const StatusIcon = styled('div')({
//   position: 'absolute',
//   opacity: 0,
//   transform: 'translateX(20px)',
//   transition: 'all 0.3s ease',
//   '&.visible': {
//     opacity: 1,
//     transform: 'translateX(0)'
//   }
// });

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

const TestPage = () => {
    const [questionList, setQuestionList] = useState<any[]>([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['갈', '마', '성', '근']);
    const [correctAnswer, setCorrectAnswer] = useState(-1);
    const [selectedAnswer, setSelectedAnswer] = useState(-1);
    const [problemIndex, setProblemIndex] = useState<number>(-1);
    const [problemType, setProblemType] = useState<number>(-1);
    const [progress, setProgress] = useState(5);



    const handleAnswerSelect = (answer: any) => {
        setSelectedAnswer(answer)
        console.log(answer, correctAnswer)
        const buttons = document.querySelectorAll('.MuiButton-root');
  
        buttons.forEach((button, index) => {
            if (index === answer) {
                if (answer === correctAnswer) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('wrong');
                    buttons.forEach((b, indexT) => {
                        if (indexT === correctAnswer) {
                            b.classList.add('correct');
                        }
                    });
                }
            }
            button.classList.add('reveal');
            // else 
            // {
            //     if (index === correctAnswer)
            //     {
            //         button.classList.add('correct');
            //     }
            // }
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

        const fetchData = async (url: string, isToken: boolean) => {
            try {
                await axios.get(url,
                {
                        headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                }
                ).then((answer) => {
                    console.log(`Get Success : ${url}`)
                    console.log(answer.data[1]['problems'][1])
                    setQuestionList(answer.data[1]['problems'][1])
                    setProblemIndex(0)
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

        fetchData('http://localhost:8080/kanzi/getTestProblems?levels=2&days=1', false);
    }, []);
    


    // function
    function startFunction() {

        const fetchData = async (url: string, isToken: boolean) => {
            try {
                await axios.get(url,
                {
                        headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                }
                ).then((answer) => {
                    console.log(`Get Success : ${url}`)
                    console.log(answer.data[1]['problems'][1])
                    setQuestionList(answer.data[1]['problems'][1])
                    setProblemIndex(0)
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

        fetchData('http://localhost:8080/kanzi/getTestProblems?levels=2&days=1', false);
    }








    useEffect(() => {
        if (problemIndex == -1) return
        setQuestion(questionList[problemIndex][1]['problemContent'])
        setCorrectAnswer(questionList[problemIndex][1]['answer'])
        setOptions(questionList[problemIndex][1]['options'][1])
        setProblemType(questionList[problemIndex][1]['problemType'])

    }, [problemIndex])
    
  return (
    <Container sx={{width: '50rem', height :'100%', minHeight :'30rem', paddingY : '1rem'}}>
      <Box sx={{ width: '100%', }}>
        <LinearProgress 
          variant="determinate" 
          value={problemIndex / questionList.length * 100 } 
          sx={{
            height: '1.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#FFE4E1',
            marginBottom :'2rem',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FFB6C1'
            }
          }}
        />
              {/* <Divider variant="middle" component="li" sx={{ listStyle: 'None' }} /> */}
              {/* <Divider variant="middle"></Divider> */}
              {/* <Divider component="li" variant="middle" sx={{ listStyle: 'none' }} /> */}
        <Divider />

        <Typography variant="h6" sx={{ my: 3, textAlign: 'left', fontSize : '2rem' }}>
                  다음 한자의 { problemType == 0 ? '문자를' : problemType == 1 ? "뜻을" : "음을"  } 선택하시오.
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
                <Grid container direction="column" sx={{ gap : '1rem'}}>
                    {options.map((option, index) => (
                        <Paper
                            sx={{width : '15rem', borderRadius : '1rem'}}
                            key={option}
                            elevation={2}
                        >
                        <AnswerButton
                            fullWidth
                            variant="outlined"
                            onClick={() => handleAnswerSelect(index)}
                                sx={{
                                    // color :'whte'
                                    
                            height: '6.75rem',
                            transition: 'all 0.3s',
                            fontSize: '2rem',
                            // 기본 호버 효과
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
                                pointerEvents : 'none',
                            }
                            }}
                            >
                                {/* 상태에 따른 아이콘 애니메이션 */}
                                <StatusIcon className={
                                    (correctAnswer === index) && selectedAnswer != -1 ? 'visible' : 
                                    (selectedAnswer === index) && selectedAnswer != correctAnswer ? 'visible' : ''
                                }>
                                {correctAnswer === index && selectedAnswer != -1  && (
                                    <Image 
                                    src={done} 
                                    alt="정답"
                                    priority
                                    style={{width : '2rem', height:'2rem'}}
                                    />
                                )}
                                {selectedAnswer === index && selectedAnswer != correctAnswer && (
                                    <Image
                                    src={close}
                                    alt="오답"
                                    style={{width : '2rem', height:'2rem'}}
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
                    ))}
                </Grid>
            </Grid>
        </Grid>
      </Box>
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
    // backgroundColor: '#FFE5C6',  // 연한 회색 배경
    borderColor: '#D2D2D2',  // 기존 보더 색상 유지
    boxShadow: theme.shadows[2],  // 그림자 효과 유지
  }
}));



export default withInitialization(TestPage ) // <= 여기다 뭐 넣기


