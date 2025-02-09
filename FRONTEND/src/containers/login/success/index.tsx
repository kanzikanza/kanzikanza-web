'use client'
import axios from 'axios'
import Script from 'next/script'
import { useEffect, useState } from 'react';
import LoginSuccessPage from './LoginSuccessPage';
import Modal from './Modal';
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from 'next/navigation';

import { styled } from "@mui/material"
import { rejects } from 'assert';


export default function LoginSuccess() {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [isSuccess, setIsSuccess] = useState(true); // 성공 여부 (null: 초기 상태)
    const params = useSearchParams();
    const router = useRouter()
    let completeUrl: string = `http://localhost:8080/auth/Oauth2/KakaoToken?code=${params.get('code')}`
    
    useEffect(() => {
    (async (resolve, rejects) =>
        {
            try {
                const response = await axios.get(completeUrl)
                .then(
                    response => {
                        console.log(response.data[1])
                        localStorage.setItem('accessToken', response.data[1].accessToken)
                        localStorage.setItem('refreshToken', response.data[1].refreshToken)
                        if (response.data[1].userNickname !== null && response.data[1].userNickname !== "")
                        {
                            router.push("/")
                        }
                        return
                    }
                )
            }
            catch (error) {
                throw `Error initiating Kakao OAuth: ${error}`
            }
        }
    )().then(
        () => {
            setLoading(false)
            setIsSuccess(true)
        }
    ).catch(

    )
    }, [])
  return (
      <div>
          {loading && (
            <Modal isOpen={loading}>
                {isSuccess ? (
                    <div>
                    <h2>로그인 성공!</h2>
                    <p>잠시 후 메인 화면으로 이동합니다...</p>
                    </div>
                ) : (
                    <div>
                    <h2>로그인 실패</h2>
                    <p>다시 로그인해주세요.</p>
                    <button onClick={() => (window.location.href = '/login')}>
                        로그인 화면으로 이동
                    </button>
                    </div>
                )}
            </Modal>
          )}
          {!loading && isSuccess && (
              <LoginSuccessPage />
          )}
    </div>
  );
};