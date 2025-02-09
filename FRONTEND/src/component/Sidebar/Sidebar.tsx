'use client'
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, styled, Typography, Divider } from '@mui/material';
import Profile from "./Profile/Profile"
import { useRouter } from 'next/navigation';

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
          <ListItem button key={text}>
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
        <Profile />
      </Box>
    </PSidebar>
  );

}