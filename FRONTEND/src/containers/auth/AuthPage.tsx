'use client'

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'
import axios from "axios";

export default function AuthPage() {
  const router = useRouter();
  const params = useParams()

  useEffect(() => {
    const code = params.code;

    if (code) {
      console.log(`code: ${code}`)
      // 서버로 코드를 전송하는 GET 요청
      axios.get('http://localhost:8080/auth/Oauth2/KakaoToken', { params: { code: code } })
        .then(response => {
          console.log('Successfully sent code to server:', response.data);
        })
        .catch(error => {
          console.error('Failed to send code to server:', error);
        });
    }
  }, [params.code]);

  
  return (
      <div>테스트 페이지</div>
  );
}
