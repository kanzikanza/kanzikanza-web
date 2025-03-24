'use client'
import withInitialization from "@/global/globalComponent";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Grid, Divider } from "@mui/material";
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
  height: "80vh",
  overflowY: "auto",
  paddingRight: "8px",
  paddingLeft : "8px",
});

// 급수 섹션 스타일
const LevelSection = styled(Box)({
  marginBottom: "32px",
  minWidth: '1000px',
  maxWidth: '60rem',
  maxHeight : '25rem',
  overflowX:'hidden'
});

// 버튼 스타일
const CircleButton = styled(Button)({
  borderRadius: "50%",
  height: "10rem",
  minWidth: "10rem",
  textTransform: "none",
  backgroundColor: "#F9DCDC", // 기본 배경색
  "&:hover": {
    backgroundColor: "#ffccbc", // 호버 시 배경색
  },
});



function UniqueName() {
  const [userStreakDays, setUserStreakDays] = useState<Number>(0)
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  useEffect(() => {
    const fetchData = async (url: string, isToken: boolean) => {
            try {
                await axios.get(url,
                {
                  headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                }
                ).then((answer) => {
                  console.log(`Get Success : ${url}`, answer)
                  console.log(answer.data[1]['userStreakDays'])
                  setUserStreakDays(answer.data[1]['userStreakDays'])
                    
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

        fetchData('http://localhost:8080/auth/getStreakDay', false);

  }, [])
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
                {level}급
              </Typography>
              <Divider variant="middle" flexItem style={{marginBottom : '20px'}} />
            
              {/* 버튼 그리드 */}
              <Grid container spacing={2} sx={{maxHeight : "24rem"}}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={2.4} key={index} >
                    <Link href="/test" passHref>
                      <CircleButton variant="contained">
                        day{index + 1}
                      </CircleButton>
                    </Link>
                  </Grid>
                ))}
              </Grid>
              
            </LevelSection>
          ))}
        </ScrollableContainer>
      </Box>
    </Box>
  );
}

// export default function Main() {
//   return (
//     withInitialization(UniqueName)
//   )
// };
export default withInitialization(UniqueName)


