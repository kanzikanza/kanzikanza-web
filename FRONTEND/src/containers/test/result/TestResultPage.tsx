'use client'
import { Container, Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { apiDecoder } from "@/global/GlobalApiDecoder";
import { useEffect, useState } from "react";
import axios from "axios";
import ComingSoon from "@/component/ComingSoon";
import { TestResultData, Problem } from "@/global/GlobalTypeContainer";
import KanzaWrongCardSlider from "@/component/KanzaWrongCardSlider";

export default function TestResultPage({isAnswered, setIsAnswered} : {isAnswered : null | boolean, setIsAnswered : null | any}) {
    // 예시 데이터 (실제 데이터로 교체 필요)
    const [score, setScore] = useState<number>(0);
    const [wrongProblems, setWrongProblems] = useState<Problem[]>([]);
    // const wrongProblems = ["문제 2", "문제 5", "문제 8"];
    const statMsg = "최근 며칠보다 5점 올랐어요~ 등등";
    const router = useRouter()
    const searchParams = useSearchParams()
    const decoder = new apiDecoder()
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP

    const levels : number = Number(searchParams.get('levels'))
    const days: number = Number(searchParams.get('days'))
    
    useEffect(() => { 
        axios.get(NEXT_PUBLIC_SERVER_IP + `/kanzi/getFinalResults?levels=${levels}&days=${days}`
            ,
            {
                headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
            }
        ).then((response) => {
            console.log(response)
            let data: TestResultData = decoder.decodeGetFinalResults(response['data'][1])
            setWrongProblems(data.wrongProblemDetail)
            setScore((20 - data.testMetaData.wrongNumbers[1].length) * 5)
         })
        
    }, [])
    setIsAnswered(true)
    
    // wrongProblems 데이터 변환 (API 예시 구조 대응)
    const wrongKanzaData = wrongProblems.map((problem: any) => {
        // API 구조에 따라 분기 처리
        if (problem.kanzaLetter && problem.kanzaMean && problem.kanzaSound) {
            // 기존 구조
            return {
                kanzaLetter: problem.kanzaLetter,
                kanzaSound: problem.kanzaSound,
                kanzaMean: problem.kanzaMean,
            }
        } else if (problem.kanzaIndex && problem.kanzaIndex[1]) {
            // API 예시 구조
            return {
                kanzaLetter: problem.kanzaIndex[1].kanzaLetter,
                kanzaSound: problem.kanzaIndex[1].kanzaSound,
                kanzaMean: problem.kanzaIndex[1].kanzaMean,
            }
        }
        return { kanzaLetter: '', kanzaSound: '', kanzaMean: '' }
    })

    return (
        <div style={{}}>
            <Container
                className="topContainter"
                sx={{
                    width: "60rem",
                    minHeight: "40rem",
                    border: "3px solid #DDA15E",
                    borderRadius: "2rem",
                    margin: "2rem auto",
                    padding: "2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 3,
                    backgroundColor: "#FFF",
                }}
            >
                <Box sx={{ display: "flex", flex: 1, gap: 4 }}>
                    {/* 틀린 문제 리스트 */}
                    <Paper
                        sx={{
                            flex: 1,
                            minHeight: "24rem",
                            margin: "1rem",
                            border: "2.5px solid #DDA15E",
                            borderRadius: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: 2,
                            backgroundColor: "#FFF",
                            overflow: "hidden"
                        }}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{ 
                                color: "#BC6C25", 
                                fontWeight: 700,
                                padding: "1rem 0",
                                marginBottom: "0.5rem"
                            }}
                        >
                            틀린 문제 리스트
                        </Typography>
                        <Box sx={{ 
                            overflowY: "auto",
                            padding: "0 1rem",
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#DDA15E',
                                borderRadius: '4px',
                            },
                        }}>
                            <List>
                                {wrongProblems.map((problem, idx) => (
                                    <ListItem 
                                        key={idx}
                                        sx={{
                                            backgroundColor: '#FFF8F0',
                                            borderRadius: '1rem',
                                            marginBottom: '0.5rem',
                                            border: '1px solid #DDA15E',
                                        }}
                                    >
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                                                {problem.kanzaLetter}
                                            </Typography>
                                            <Typography sx={{ color: '#666' }}>
                                                {problem.kanzaMean}
                                            </Typography>
                                            <Typography sx={{ color: '#BC6C25' }}>
                                                {problem.kanzaSound}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>

                    {/* 점수 및 통계 */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: "24rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4
                        }}
                    >
                        {/* 점수 컴포넌트 */}
                        <Paper
                            sx={{
                                flex: 1,
                                margin: "1rem",
                                border: "2.5px solid #DDA15E",
                                borderRadius: "1.5rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: 2,
                                backgroundColor: "#FFF",
                                minHeight: "11rem"
                            }}
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                                sx={{ color: "#BC6C25", fontWeight: 700 }}
                            >
                                점수
                            </Typography>
                            <Typography variant="h6" align="center">
                                당신은 {score}점입니다
                            </Typography>
                        </Paper>
                        {/* 최근 점수 컴포넌트 (비활성화, 추후 공개) */}
                        <Paper
                            sx={{
                                flex: 1,
                                margin: "1rem",
                                border: "2.5px dashed #DDA15E",
                                borderRadius: "1.5rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: 0,
                                backgroundColor: "#F5F5F5",
                                opacity: 0.6,
                                minHeight: "11rem"
                            }}
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                                sx={{ color: "#BC6C25", fontWeight: 700 }}
                            >
                                최근 점수 비교
                            </Typography>
                            <ComingSoon />
                        </Paper>
                    </Box>
                </Box>

                {/* 돌아가기 버튼 */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#FFCC99',
                            color: '#333',
                            fontWeight: 700,
                            border: "2px solid #DDA15E",
                            borderRadius: "1rem",
                            '&:hover': {
                                backgroundColor: '#FFB366',
                            },
                            minWidth: '12rem',
                            fontSize: "1.2rem"
                        }}
                        onClick={() => { router.push('/')}}
                    >
                        돌아가기
                    </Button>
                </Box>
            </Container>
        </div>
    )
}