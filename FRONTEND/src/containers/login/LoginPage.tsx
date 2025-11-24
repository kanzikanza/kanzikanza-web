'use client'
// import Layout from "@/component/Layout/Layout";
import Image from "next/image"
import axios from 'axios'
import Link from 'next/link'

import kakaoLoginImage from "@/assets/kakao_login_large_narrow.png"
import { ImageStyle } from "@/global/globalImage"
import SmallButton from "../../component/Button/SmallButton";

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
    <div className="min-h-[400px] flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <Link 
          href="/" 
          className="no-underline mb-4 font-['Pretendard',sans-serif] text-[2.5rem] font-extrabold text-[#333] text-center tracking-tight"
        >
          칸<span className="text-[#FFE812] [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)]">지</span>칸<span className="text-[#FFE812] [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)]">자</span>
        </Link>
        
        <div 
          className="cursor-pointer transition-transform duration-200 w-full max-w-[300px] hover:scale-105"
          onClick={handleLogin}
        >
          <Image
            src={kakaoLoginImage}
            width={300}
            height={45}
            alt="Kakao Login Button"
            style={imageStyle}
          />
        </div>

        <div className="w-full flex items-center gap-4 text-[#666] text-[0.9rem] before:content-[''] before:flex-1 before:h-px before:bg-[#e0e0e0] after:content-[''] after:flex-1 after:h-px after:bg-[#e0e0e0]">
          또는
        </div>

        <p className="flex items-center gap-2 text-[#666] text-[0.9rem] mt-4 text-center">
          보유한 아이디가 없으신가요? 
          <SmallButton onClick={handleLogin}>카카오로 1초만에 가입하기</SmallButton>
        </p>
      </div>
    </div>
  )
}
