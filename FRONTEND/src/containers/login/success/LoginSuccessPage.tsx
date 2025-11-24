'use client'

import Image from "next/image"
import kakaoLoginImage from "@/public/assets/kakao_login_large_narrow.png"

// MUI removed
import { useState } from 'react'
import { style } from "@vanilla-extract/css";
import { useIndexedDB, createObject, putImageInDb } from "@/global/globalFunction"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

// Styled components removed - using Tailwind classes
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
      const response = await api.patch(
        '/auth/setDefaultProfile',
        {
              type: "ProfileRequest",
              nickname : inputValue,
              profileIndex: selectedIndex
        }
        ,
        // {
        //   headers: {
        //     "X-Requested-With": "XMLHttpRequest",
        //     "Content-Type": "application/json-patch+json",
        //     Authorization : `Bearer ${localStorage.getItem('accessToken')}`
        //   }
        // }
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
    <div
      id="LoginSuccessProfile"
      className="min-h-[400px] flex h-[70vh] relative w-[800px] justify-center items-stretch flex-col mx-12"
    >
      {/* <Image src={kakaoLoginImage} alt="Kakao Login" /> */}
            <div className="flex justify-start items-center border-2 border-[#D2D2D2] rounded-[1.5rem] flex-row absolute top-0">
              <p className="flex items-center flex-row mx-8 my-8 font-bold text-[2rem] min-w-[20rem]">
                닉네임
              </p>
              <div className="h-[100px] flex w-full items-center">
                <input
                  id="standard-basic"
                  placeholder="입력창"
                  className="w-[calc(32rem+60px)] mr-5 ml-5 text-[2rem] border-b border-gray-300 focus:border-orange-400 focus:outline-none pb-2"
                  onChange={(e) => {
                      setInputValue(e.target.value)
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-2 border-[#D2D2D2] rounded-[1.5rem] flex-row flex-grow absolute top-[25%] min-h-[350px] h-1/2">
              <p className="flex items-center flex-row mx-8 my-8 font-bold text-[2rem] min-w-[20rem]">
                프로필 이미지
              </p>
              <div className="grid grid-cols-4 gap-5 justify-center items-center p-5">
                  {profiles.map((key, index) => (
                    <div
                      key={key}
                      className={`${selectedIndex === index + 1 ? 'w-[calc(8rem-8px)] h-[calc(8rem-8px)]' : 'w-32 h-32'} rounded-full bg-[#f7c98c] flex justify-center items-center cursor-pointer ${selectedIndex === index + 1 ? 'border-4 border-[#ff8c00]' : 'border-0'} transition-all`}
                      onClick={() => handleSelect(index + 1)}
                    >
                      <Image src={require(`@/assets/profile-images/${key}`).default} alt={`Profile ${index + 1}`} style={{'width' : '6rem'}}/>
                    </div>
                  ))}
              </div>
            </div>
            <button
              disabled={selectedIndex === -1 || inputValue === "" ? true : false}
              onClick={handleLogin}
              className="absolute top-[95%] w-1/2 h-20 text-5xl bg-[#FFD099] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB366] transition-colors rounded-lg"
            >
                  가입하기
            </button>
        </div>
    )
}