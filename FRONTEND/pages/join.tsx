import Layout from "@/component/Layout";

export default function join() {

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
    <Layout>
      회원 가입~~~~~~~~!ㅋ
      카카오 소셜 로그인 구현할 거임!
    </Layout>
  )
}