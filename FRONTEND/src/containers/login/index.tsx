'use client';

import { useEffect } from 'react';
import { pageTitle } from "@/src/styles/common.css";
import Image from "next/image";
import * as styles from './index.css'
import kakaoLogin from '#/images/kakao_login_large_narrow.png';
import Script from 'next/script';

export default function Login() {
  useEffect(() => {
    // SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('카카오키자리');
    }
  }, []);

  const handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: function (authObj) {
        console.log(authObj);
      },
      fail: function (err) {
        console.error(err);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Script 
        src="https://developers.kakao.com/sdk/js/kakao.min.js" 
        strategy="beforeInteractive"
      />
      <div className={pageTitle}>로그인</div>
      <button onClick={handleKakaoLogin}>
        <Image src={kakaoLogin} alt="카카오 로그인" />
      </button>
    </div>
  );
};
