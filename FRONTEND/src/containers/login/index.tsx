'use client'

import { pageTitle } from "@/src/styles/common.css";
import Image from "next/image";
import kakaoLogin from '#/images/kakao_login_large_narrow.png';

export default function Login() {
  return (
    <div>
      <div className={pageTitle}>로그인</div>
      <Image src={kakaoLogin} alt="카카오 로그인" />
    </div>
  );
};