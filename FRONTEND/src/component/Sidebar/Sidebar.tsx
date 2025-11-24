'use client'
import React from 'react';
import Profile from "./Profile/Profile"
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import Link from 'next/link';
import api from '@/lib/api'

export default function Sidebar() {
  const router = useRouter()
  const urlPath = ['/', '/review', '/kandle']
  const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
  const [userNickName, setUserNickName] = useState<String>("");
  const [userProfileIndex, setUserProfileIndex] = useState<Number>(-1);
  
  useEffect(() => {
    const fetchData = async (url: string, isToken: boolean) => {
      try {
        await api.get(url,
        // {
        //   headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
        // }
        ).then((answer) => {
          console.log(`Get Success : ${url}`, answer)
          console.log(answer.data[1]['nickname'])
          setUserNickName(answer.data[1]['nickname'])
          setUserProfileIndex(answer.data[1]['profileIndex'])
        })
        .catch((error) => {
          console.log(error)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(NEXT_PUBLIC_SERVER_IP + '/auth/getSimpProfile', false);
  }, [])

  return (
    <aside className="w-60 flex-grow-0 box-border h-screen bg-[#FFCC99] flex flex-col justify-between">
      <ul className="list-none p-0 m-0">
        <Link 
          href="/" 
          className="font-['Noto_Sans_KR',sans-serif] text-[2.2rem] font-medium tracking-[-0.5px] text-[#444] no-underline transition-colors duration-300 block p-4 mb-4 hover:text-[#222]"
        >
          칸지칸자
        </Link>
        <hr className="border-t border-gray-300 mx-4" />
        {['테스트 보기', '복습하기', '칸들'].map((text, index) => (
          <li 
            key={text}
            onClick={() => { 
              router.push(urlPath[index])
            }}
            className="transition-colors duration-300 rounded-lg m-1 mx-2 p-4 cursor-pointer hover:bg-white/20"
          >
            <span className="text-[1.3rem] font-medium">{text}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center p-4">
        <Profile
          userNickName={userNickName}
          userProfileIndex={userProfileIndex}
        />
      </div>
    </aside>
  );
}