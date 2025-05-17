'use client'
import axios from 'axios'
import Script from 'next/script'
import { Suspense } from 'react'
import { useEffect, useState } from 'react';
import LoginSuccessPage from './LoginSuccessPage';
import Modal from './Modal';
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from 'next/navigation'
import { apiDecoder } from '@/global/GlobalApiDecoder';

import { styled } from "@mui/material"
import { rejects } from 'assert';


export function LoginSuccess() {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 (null: 초기 상태)
    const params = useSearchParams();
    const router = useRouter()
    const decoder = new apiDecoder()
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    
    let completeUrl: string = `${NEXT_PUBLIC_SERVER_IP}/auth/Oauth2/KakaoToken?code=${params.get('code')}`
    
    useEffect(() => {
        
        try {
            const response = axios.get(completeUrl)
            .then(
                response => {
                    console.log(response.data)
                    const [token, defaultProfile] = decoder.decodeLoginReponse(response.data)
                    localStorage.setItem('accessToken', token.accessToken)
                    localStorage.setItem('refreshToken', token.refreshToken)

                    if (defaultProfile.nickname !== null && defaultProfile.nickname !== "")
                    {
                        router.push("/")
                        return true;
                    }
                    else
                    {
                        setLoading(false)
                        setIsSuccess(true)
                    }
                    console.log("SERVICE ORDER : 1")
                    return false;
                }
            )

        }
        catch (error) {
            throw `Error initiating Kakao OAuth: ${error}`
        }
    }, [params, router])
  return (
      <>
          {/* {loading && (
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
          )} */}
          {!loading && isSuccess && (
              <LoginSuccessPage />
          )}
    </>
  );
};

export default function LoginModal() {
    return (
        <LoginSuccess
        />
    )
}
