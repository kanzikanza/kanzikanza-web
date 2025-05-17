'use client'
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, styled, Typography, Divider } from '@mui/material';
import Profile from "./Profile/Profile"
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import Link from 'next/link';

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

const Logo = styled(Link)`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: -0.5px;
  color: #444;
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  
  &:hover {
    color: #222;
  }
`;

const MenuItem = styled(ListItem)`
  transition: background-color 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function Sidebar() {
  const router = useRouter()
  const urlPath = ['/', '/review']
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(NEXT_PUBLIC_SERVER_IP + '/auth/getSimpProfile', false);
  }, [])

  return (
    <PSidebar variant="permanent">
      <List>
        <Logo href="/">칸지칸자</Logo>
        <Divider variant="middle" flexItem />
        {[ '테스트 보기', '복습하기'].map((text, index) => (
          <MenuItem 
            key={text}
            onClick={() => { 
              router.push(urlPath[index])
            }}
          >
            <ListItemText 
              primary={text} 
              primaryTypographyProps={{
                fontSize: '1.3rem',
                fontWeight: 500,
              }}
            />
          </MenuItem>
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