'use client'
import { Container, Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { apiDecoder } from "@/global/GlobalApiDecoder";
import { useEffect } from "react";
import axios from "axios";

export default function TestResultPage({isAnswered, setIsAnswered} : {isAnswered : null | boolean, setIsAnswered : null | any}) {
    // 예시 데이터 (실제 데이터로 교체 필요)
    const score = 85;
    const wrongProblems = ["문제 2", "문제 5", "문제 8"];
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
         })
        
    }, [])
    setIsAnswered(true)
    
    return (
        <Container
            className="topContainter"
            sx={{
                width: "50rem",
                height: "100%",
                minHeight: "30rem",
                paddingY: "1rem",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", flex: 1, gap: 4 }}>
                {/* 틀린 문제 리스트 */}
                <Paper
                    sx={{
                        flex: 1,
                        minHeight: "20rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Box>
                        <Typography variant="h6" align="center" gutterBottom>
                            틀린 문제 리스트
                        </Typography>
                        <List>
                            {wrongProblems.map((problem, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText primary={problem} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>

                {/* 점수 및 통계 */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: "20rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >
                    <Paper
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            p: 2,
                            minHeight: "9rem"
                        }}
                    >
                        <Typography variant="h6" align="center">
                            당신은 {score}점입니다
                        </Typography>
                    </Paper>
                    <Paper
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            minHeight: "9rem"
                        }}
                    >
                        <Typography align="center">{statMsg}</Typography>
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
                        '&:hover': {
                            backgroundColor: '#FFB366',
                        },
                        minWidth: '10rem'
                    }}
                >
                    돌아가기
                </Button>
            </Box>
        </Container>
    )
}