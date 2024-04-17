import Layout from "@/component/Layout";

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from "axios";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    const code = router.query.code;

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
  }, [router.query.code]);

  
  return (
    <Layout>
      테스팅
    </Layout>
  );
}
