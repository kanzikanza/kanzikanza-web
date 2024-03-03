import Layout from "@/component/Layout";
import Image from "next/image"; // Import the next/image module
import kakaoLoginImage from "@/public/assets/kakao_login_large_narrow.png";

import { styled } from "@mui/material";

const MainContainer = styled('div')`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const GoJoin = styled('p')`
  color: darkgray;
  margin-top: 30px;
`

export default function login() {
  return (
    <Layout>
      <MainContainer>
        <Image src={kakaoLoginImage} alt="Kakao Login" />
        {/* Your text goes here */}
        <GoJoin>보유한 아이디가 없으신가요? 카카오톡으로 1초만에 가입하기!</GoJoin>
      </MainContainer>
    </Layout>
  )
}
