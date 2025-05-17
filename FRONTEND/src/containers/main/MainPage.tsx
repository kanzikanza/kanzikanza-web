'use client'
import withInitialization from "@/global/globalComponent";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Grid, Divider, CircularProgress } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { apiDecoder } from "@/global/GlobalApiDecoder";
import { TestConfigDto } from "@/global/GlobalTypeContainer";
// import { useRouter } from 'next/navigation';

import Link from "next/link";

// 상단 상태 표시 스타일
const StatusBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: '3rem',
  marginBottom: "10px",
  padding: "16px",
  border: "1px solid #000000",
  borderRadius: "8px",
  backgroundColor: "#ffe",
});

// 급수 리스트 스타일
const ScrollableContainer = styled(Box)({
  height: "85vh",
  overflowY: "auto",
  paddingRight: "8px",
  paddingLeft : "8px",
});

// 급수 섹션 스타일
const LevelSection = styled(Box)({
  marginBottom: "10px",
  minWidth: '60rem',
  // maxWidth: '60rem',
  maxWidth: '100%',
  maxHeight : '27rem',
  overflowX:'hidden'
});

// 버튼 스타일
const CircleButton = styled(Button)({
    borderRadius: "50%",
    height: "10rem",
    minWidth: "10rem",
    margin: "2px",
    textTransform: "none",
    backgroundColor: "#F9DCDC",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
        backgroundColor: "#ffccbc",
    },
    "& .MuiTypography-root": {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#666666",
        position: "relative",
        zIndex: 2,
    },
    "&.locked": {
        backgroundColor: "#E0E0E0",
        cursor: "not-allowed",
        "&:hover": {
            backgroundColor: "#E0E0E0",
        },
    },
});

const ProgressOverlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    "& .MuiCircularProgress-root": {
        color: "#FF8C69",
    },
    "& .MuiCircularProgress-circle": {
        strokeWidth: 8,
    },
});

const LockOverlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    zIndex: 2,
});

function UniqueName({isAnswered, setIsAnswered}) {
    const [userStreakDays, setUserStreakDays] = useState<Number>(0)
    const levels = [8, 7, 6, 5, 4, 3, 2, 1, 0]

    const MaxDays = 5
    const totalLevels = 9
    const stateArrays = [0,]
    const progressArrays = [0,]
    stateArrays.length = MaxDays * totalLevels
    progressArrays.length = MaxDays * totalLevels
    stateArrays.fill(0)
    progressArrays.fill(0)

    
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    const decoder = new apiDecoder()
    const [useStateArrays, setUseStateArrays] = useState<any>(new Array(MaxDays * totalLevels).fill(0))
    const [useProgressArrays, setUseProgressArrays] = useState<any>(new Array(MaxDays * totalLevels).fill(0))
    const [unlockList, setUnlockList] = useState<[string, TestConfigDto][] | null>(null);
  console.log(NEXT_PUBLIC_SERVER_IP, process, process.env)

  setIsAnswered(true)
  useEffect(() => {
    const fetchData = async (url: string, isToken: boolean) => {
            try {
                await axios.get(url,
                {
                  headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                }
                ).then((answer) => {
                    console.log(`Get Success : ${url}`, answer)
                    const [defaultProfile, testConfig] = decoder.decodeMainPageResponse(answer.data)
                    console.log(testConfig)

                    const useStateArrays_copy = [...useStateArrays]
                    const useProgressArrays_copy = [...useProgressArrays]
                    testConfig.forEach((x) => {
                        x[1].testLevel
                        x[1].usetTestDays
                        x[1].userTestProgress
                        useStateArrays_copy[(x[1].testLevel - 1) * MaxDays + x[1].usetTestDays - 1] = 1
                        useProgressArrays_copy[(x[1].testLevel - 1) * MaxDays + x[1].usetTestDays - 1] = x[1].userTestProgress
                    })
                    console.log(stateArrays)
                    console.log(progressArrays)
                    setUseStateArrays(useStateArrays_copy)
                    setUseProgressArrays(useProgressArrays_copy)
                    setUserStreakDays(defaultProfile.userStreakDays)
                    
                })
                .catch((error) => {
                    console.log(error)
                    
                });
                // let response: any[] = []
                // if (!response ) {
                //     throw "response doesn't have val"
                // }
                // console.log(response);
                // response = response.map((x) => x[1])
                // setKanzas(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(NEXT_PUBLIC_SERVER_IP + '/auth/getStreakDay', false);

  }, [])

  const isLocked = (level: number, index: number) => {
      // 임시 로직 - 나중에 API로 대체
    return useStateArrays[level * MaxDays + index] === 0
  };

  return (
    <Box sx={{ display: "flex", padding: "16px" }}>
      {/* 상단 상태 표시 */}
      <Box sx={{ flexGrow: 1 }}>
        <StatusBox>
          <Typography variant="h6">
            🔥 {String(userStreakDays)} 일 째 도전 중!
          </Typography>
        </StatusBox>

        {/* 스크롤 가능한 리스트 */}
        <ScrollableContainer>
          {levels.map((level) => (
            <LevelSection key={level}>
              {/* 급수 제목 */}
              <Typography variant="h4" gutterBottom>
                {level + 1}급
              </Typography>
              <Divider variant="middle" flexItem style={{marginBottom : '20px'}} />
            
              {/* 버튼 그리드 */}
              <Grid container spacing={2}>
              {/* <Grid container spacing={1} justifyContent="center"> */}
                {Array.from({ length: 5 }).map((_, index) => {
                  const locked = isLocked(level, index);
                  const progress = useProgressArrays[level* MaxDays + index] || 0;
                  
                  return (
                    <Grid item xs={2.4} key={index}>
                      <Link href={locked ? '#' : `/test?levels=${level}&days=${index}`}>
                        <CircleButton 
                          variant="contained" 
                          className={locked ? 'locked' : ''}
                          disabled={locked}
                        >
                          <Typography>
                            第 {index + 1}章
                          </Typography>
                          <ProgressOverlay>
                            <CircularProgress 
                              variant="determinate" 
                              value={progress * 10} 
                              size={160}
                              thickness={8}
                              sx={{
                                position: 'absolute',
                                color: '#FF8C69',
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                          </ProgressOverlay>
                          {locked && (
                            <LockOverlay>
                              <LockIcon sx={{ fontSize: 40, color: 'white' }} />
                            </LockOverlay>
                          )}
                        </CircleButton>
                      </Link>
                    </Grid>
                  );
                })}
              </Grid>
              
            </LevelSection>
          ))}
        </ScrollableContainer>
      </Box>
    </Box>
  );
}
export default UniqueName