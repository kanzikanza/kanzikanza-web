import Layout from "@/component/Layout";
import Image from "next/image"; // Import the next/image module
import axios from 'axios';
import kakaoLoginImage from "@/public/assets/kakao_login_large_narrow.png";
import { styled } from "@mui/material";
import SmallButton from "@/component/Button/SmallButton";

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
    <MainContainer>
      <Image src={kakaoLoginImage} alt="Kakao Login" />
      <GoJoin>
        보유한 아이디가 없으신가요? 카카오톡으로 1초만에 <SmallButton onClick={handleLogin}>가입</SmallButton>하기!
      </GoJoin>
    </MainContainer>
  )
}
