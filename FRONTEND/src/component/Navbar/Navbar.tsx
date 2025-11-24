'use client'
import React from 'react';

export default function Navbar() {
  return (
    <nav className="h-[100px] flex bg-[#ffdd9e] m-0 px-5 items-center">
      <a 
        href="/" 
        className="font-['Noto_Sans_KR',sans-serif] text-[2.2rem] font-medium tracking-[-0.5px] mr-10 text-[#444] no-underline transition-colors duration-300 hover:text-[#222]"
      >
        칸지칸자
      </a>
      <div className="mr-auto pr-12">
        <a 
          href="/" 
          className="text-[1.3rem] mx-4 font-medium text-[#444] no-underline transition-colors duration-300 hover:text-[#222]"
        >
          홈
        </a>
      </div>
      <div className="ml-auto">
        <a 
          href="/login" 
          className="text-[1.3rem] mx-4 font-medium text-[#444] no-underline transition-colors duration-300 hover:text-[#222]"
        >
          로그인
        </a>
      </div>
    </nav>
  );
}
