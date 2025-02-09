'use client'
import React from 'react';
import * as style from './navbar.css';
import { styled } from "@mui/material"


const NavContainer = styled('nav')`
  height: 100px;
  display: flex;
  background-color: #ffdd9e;
  margin: 0;
  padding: 0 20px 0 20px;
  align-items: center;
`


export default function Navbar() {
  return (
    <NavContainer >
      <p className={style.menuLink}>칸지칸자</p>
      <div className={style.leftMenu}>
        <a href="/" className={style.menuLink}>홈</a>
        <a href="/exam" className={style.menuLink}>시험 보기</a>
      </div>
      <div className={style.rightMenu}>
        <a href="/login" className={style.menuLink}>로그인</a>
      </div>
    </NavContainer>
  );
}
