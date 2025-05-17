'use client'

import Image from "next/image"
import axios from 'axios'
import kakaoLoginImage from "@/public/assets/kakao_login_large_narrow.png"

import { Button, styled, TextField, createTheme, alpha, getContrastRatio } from "@mui/material"
import { useState } from 'react'
import { style } from "@vanilla-extract/css";
import { useIndexedDB, createObject, putImageInDb } from "@/global/globalFunction"
import { useRouter } from "next/navigation"

const MainContainer = styled('div')`
  min-height: 400px;
  display: flex;
  height: 70vh; 
  position: relative;
  width : 800px;

  justify-content: center;
  align-items: stretch
  flex-direction: column;
  margin : 0px 50px 0px 50px;
`
const ColumnContainer = styled('div')`
  display: flex;
  justify-content: left;
  align-items: center;
  border: 2px solid #D2D2D2;
  border-radius: 1.5rem;
  flex-direction: row;
`
const TopContainer = styled(ColumnContainer)`

  position: absolute;
  top: 0%;
`
const BottomContainer = styled(ColumnContainer)`
  flex-grow: 1;
  position: absolute;
  top: 25%;
  min-height : 350px;
  justify-content: space-between;
  height: 50%;
`
const ReportButton = styled(Button)`
  position: absolute;
  top: 95%;
  width: 50%;
  height: 5rem;
  font-size:3rem;
  background-color: #FFD099
`
const GoJoin = styled('p')`
  display: flex;
  align-items: center;
  flex-direction: row;
  color: darkgray;
  margin-top: 30px;
`
const ContainerTitle = styled('p')`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 30px;
  font-weight: bold;
  font-size : 2rem;
  margin-top: 30px;
  min-width : 20rem;
`
const ProfileContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4개의 열 */
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
interface ProfileItemProps {
  isSelected?: boolean;
}

const ProfileItem = styled('div')<ProfileItemProps>`
  width: ${(props) => (props.isSelected ? 'calc(8rem - 8px)' : '8rem')}; /* 선택 시 강조 */;
  height: ${(props) => (props.isSelected ? 'calc(8rem - 8px)' : '8rem')}; /* 선택 시 강조 */;
  border-radius: 50%;
  background-color: #f7c98c; /* 원형 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.isSelected ? '4px solid #ff8c00' : '0px')}; /* 선택 시 강조 */
`;
const ProfileImage = styled('img')`
  width: 60%;
  height: auto;
  border-radius: 50%;
`;
const InputForm = styled('div')`
  height: 100px;
  display: flex;
  width: 100%;
  align-items: center;
`
const InputText = styled(TextField)`
  width: calc(32rem + 60px);
  margin-right: 20px;
  margin-left: 20px;
`
export default function LoginSuccessPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()
  const profiles = [
    'User_1.png',
    'User_2.png',
    'User_3.png',
    'User_4.png',
    'User_5.png',
    'User_6.png',
    'User_7.png',
    'User_8.png',
  ];
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP


  const handleSelect = (index : number) => {
    setSelectedIndex(index);
    console.log(`Selected Profile Index: ${index}`);
  };
  

  const handleLogin = async () => {
    try {
      let datas = {
        nickname: inputValue,
        profileIndex: selectedIndex
      }
      let headers = {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      };
      const response = await axios.patch(
        NEXT_PUBLIC_SERVER_IP + '/auth/setDefaultProfile',
        {
              type: "ProfileRequest",
              nickname : inputValue,
              profileIndex: selectedIndex
        }
        ,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json-patch+json",
            Authorization : `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
        // headers
        // data : data
        )
      .then(response => {
        console.log(response)
        // console.log(profiles[selectedIndex - 1])
        // console.log(require(`@/assets/profile-images/${profiles[selectedIndex - 1]}`).default.src)
        let db : any = null
        
        const request = indexedDB.open("profile", 2);
        request.onupgradeneeded = e => {
          db = request.result
          db.createObjectStore("profile", {autoIncrement: true})
        }
        request.onsuccess = e => {
          console.log(request)
          db = request.result

          createObject(db, require(`@/assets/profile-images/${profiles[selectedIndex - 1]}`).default.src)
        }
        request.onerror = e => {
          alert("error is called");
            db = null
        }
        router.push("/")
        // const filereader = new FileReader();


      });
    } catch (error) {
      console.error('Error about updating:', error);
    }
  };
  
  return (
    <MainContainer
      id="LoginSuccessProfile"
    >
      {/* <Image src={kakaoLoginImage} alt="Kakao Login" /> */}
            <TopContainer>
              <ContainerTitle>
                닉네임
              </ContainerTitle>
              <InputForm>
                <InputText
                id="standard-basic" variant="standard" 
                placeholder="입력창"
                inputProps={{ style: { fontSize: '2rem' } }} 
                onChange={(e) => {
                      setInputValue(e.target.value)
                      // setIsInputValid(true) // 입력이 변경되면 경고 메시지를 숨김
                }}
                />
              </InputForm>
            </TopContainer>

            <BottomContainer>
              <ContainerTitle>
                프로필 이미지
              </ContainerTitle>
              <ProfileContainer>
                  {profiles.map((key, index) => (
                    <ProfileItem
                      key={key}
                      isSelected={selectedIndex === index + 1}
                      onClick={() => handleSelect(index + 1)}
                    >
                      <Image src={require(`@/assets/profile-images/${key}`).default} alt={`Profile ${index + 1}`} style={{'width' : '6rem'}}/>
                    </ProfileItem>
                  ))}
              </ProfileContainer>
            </BottomContainer>
            <ReportButton
              color="warning"
              disabled={selectedIndex === -1 || inputValue === "" ? true : false}
              onClick={handleLogin}
            >
                  가입하기
            </ReportButton>
        </MainContainer>
    )
}