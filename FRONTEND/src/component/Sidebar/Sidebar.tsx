'use client'
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, styled, Typography, Divider } from '@mui/material';
import Profile from "./Profile/Profile"
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';


const PSidebar = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexGrow: 0,
  boxSizing: 'border-box',
  height : '100vh',
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: '#FFCC99',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
export default function Sidebar() {
  const router = useRouter()
  const urlPath = ['/exam', '/', '/test']
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
  const [userNickName, setUserNickName] = useState<String>("");
  const [userProfileIndex, setUserProfileIndex] = useState<Number>(-1);
  useEffect(() => {
      const fetchData = async (url: string, isToken: boolean) => {
              try {
                  await axios.get(url,
                  {
                    headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                  }
                  ).then((answer) => {
                    console.log(`Get Success : ${url}`, answer)
                    console.log(answer.data[1]['nickname'])
                    setUserNickName(answer.data[1]['nickname'])
                    setUserProfileIndex(answer.data[1]['profileIndex'])
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

          fetchData(NEXT_PUBLIC_SERVER_IP + '/auth/getSimpProfile', false);

    }, [])

    return (
    <PSidebar
      variant="permanent"
    >
        <List>
                
        <Typography variant="h6" style={{fontSize: '1.5rem', padding:"1rem", marginBottom:"1rem"}}>
            칸지칸자
        </Typography>
        <Divider variant="middle" flexItem />
        {['시험 보기', '복습하기', '테스트 보기'].map((text, index) => (
            <ListItem key={text}>
              <ListItemText primary={text} primaryTypographyProps={{
                      fontSize: '1.5rem', // 폰트 크기
              }}
              onClick={() => { 
                router.push(urlPath[index])
              }}
          
                />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Profile
            userNickName={userNickName}
            userProfileIndex={userProfileIndex}
        />
      </Box>
    </PSidebar>
  );

}