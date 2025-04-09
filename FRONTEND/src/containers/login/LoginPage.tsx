'use client'
// import Layout from "@/component/Layout/Layout";
import Image from "next/image"
import axios from 'axios'

import kakaoLoginImage from "@/assets/kakao_login_large_narrow.png"
import { ImageStyle } from "@/global/globalImage"
import { styled } from "@mui/material"
import SmallButton from "../../component/Button/SmallButton";

const MainContainer = styled('div')`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const GoJoin = styled('p')`
  display: flex;
  align-items: center;
  flex-direction: row;
  color: darkgray;
  margin-top: 30px;
`

export default function LoginPage() {

  const imageStyle: ImageStyle = {
    width: '16rem',
    height : 'auto'
  }
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
  const KAKAO_API = process.env.KAKAO_RESTAPI
  const handleLogin = async () => {
    try {
      const response = await axios.get(NEXT_PUBLIC_SERVER_IP + '/auth/Oauth2/KakaoLogin')
      .then(response => {
        console.log(response.data)
        let queryString = `${response.data[1].link}?response_type=code&client_id=${KAKAO_API}&redirect_uri=${'http://localhost:3000/login/success'}`
        console.log(queryString)
        const popup = window.open(queryString, 'socialLoginPopup', 'width=500,height=600');

      });
    } catch (error) {
      console.error('Error initiating Kakao OAuth:', error);
    }
  };

  return (
    <MainContainer>
      {/* <Image src={kakaoLoginImage} alt="Kakao Login" /> */}
      <Image
        // src="/@/assets/kakao_login_large_narrow.png"
        src={kakaoLoginImage}
        width={100}
        height={100}
        style={imageStyle}
        alt="Kakao Login" />

      <GoJoin>
        보유한 아이디가 없으신가요? 카카오톡으로 1초만에 <SmallButton onClick={handleLogin}>가입</SmallButton>하기!
      </GoJoin>
    </MainContainer>
  )
}
