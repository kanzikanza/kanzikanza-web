'use-client'
import Link from 'next/link';
// import { style } from '@vanilla-extract/css';
import { styled, Grid } from '@mui/material'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Nav = styled(Grid)`
  height: 50px;
  background-color: #ffdd9e;
  margin: 0 0 50px 0;
  padding: 0 20px 0 20px;  
  display: flex;
  align-items: center; 
`
const LeftMenu = styled(Grid)`
  margin-right: auto;
  padding: 0 50px 0 0;
`

const RightMenu = styled(Grid)`
  margin-left: auto;
`

const MenuLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-size: 16px;
  margin: 0 15px;
  transition: color 0.3s ease;
  &:hover {
    color: #ff6347; /* Hover 시에 색상 변경 */
  }
`;


export default function Navbar() {
  const [popup, setPopup] = useState(null);
  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/Oauth2/KakaoLogin')
      .then(response => {
        // 받은 HTML을 DOM에 추가하여 렌더링
        // document.getElementById('kakao-login-container').innerHTML = response.data;
        console.log(response.data)
        const api_key = "e0fa9c3226566a2dcda49e672fe892ac"
        let queryString = `${response.data.link}?response_type=code&client_id=${api_key}&redirect_uri=${response.data.redirect}`
        console.log(queryString)
        window.open(queryString, 'socialLoginPopup', 'width=500,height=600');

      });
    } catch (error) {
      console.error('Error initiating Kakao OAuth:', error);
    }
  };
  return (
    <Nav container>
      <LeftMenu item xs={3}>
        <MenuLink href="/">홈</MenuLink>
        <MenuLink href="/test">시험 보기</MenuLink>
      </LeftMenu>
      <RightMenu item>
        <MenuLink href="/login">로그인</MenuLink>
        <MenuLink href="/join">회원가입</MenuLink>
        <button onClick={handleLogin}>임시 카카오</button>
      </RightMenu>
    </Nav>
  );
}
