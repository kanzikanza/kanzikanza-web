'use client'
// import Layout from "@/component/Layout/Layout";
import Image from "next/image"
import axios from 'axios'
import Link from 'next/link'

import kakaoLoginImage from "@/assets/kakao_login_large_narrow.png"
import { ImageStyle } from "@/global/globalImage"
import { styled } from "@mui/material"
import SmallButton from "../../component/Button/SmallButton";

const MainContainer = styled('div')`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginBox = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`

const LogoLink = styled(Link)`
  text-decoration: none;
  margin-bottom: 1rem;
  font-family: 'Pretendard', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  text-align: center;
  letter-spacing: -0.02em;
  
  span {
    color: #FFE812;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }
`

const KakaoLoginButton = styled('div')`
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    transform: scale(1.02);
  }
`

const Divider = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }
`

const GoJoin = styled('p')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`

export default function LoginPage() {
  const imageStyle: ImageStyle = {
    width: '100%',
    height: 'auto'
  }
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
  const NEXT_PUBLIC_MY_IP = process.env.NEXT_PUBLIC_MY_IP
  const KAKAO_API = process.env.NEXT_PUBLIC_KAKAO_RESTAPI
  const handleLogin = async () => {
    try {
      const response = await axios.get(NEXT_PUBLIC_SERVER_IP + '/auth/Oauth2/KakaoLogin')
      .then(response => {
        console.log(response.data)
        let queryString = `${response.data[1].link}?response_type=code&client_id=${KAKAO_API}&redirect_uri=${`${NEXT_PUBLIC_MY_IP}/login/success`}`
        console.log(queryString)
        window.location.href = queryString;
      });
    } catch (error) {
      console.error('Error initiating Kakao OAuth:', error);
    }
  };

  return (
    <MainContainer>
      <LoginBox>
        <LogoLink href="/">
          칸<span>지</span>칸<span>자</span>
        </LogoLink>
        
        <KakaoLoginButton onClick={handleLogin}>
          <Image
            src={kakaoLoginImage}
            width={300}
            height={45}
            alt="Kakao Login Button"
            style={imageStyle}
          />
        </KakaoLoginButton>

        <Divider>또는</Divider>

        <GoJoin>
          보유한 아이디가 없으신가요? 
          <SmallButton onClick={handleLogin}>카카오로 1초만에 가입하기</SmallButton>
        </GoJoin>
      </LoginBox>
    </MainContainer>
  )
}
