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

const HoverLink = styled('a')`
  color: #444;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #222;
  }
`

const Logo = styled(HoverLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin-right: 40px;
`

const MenuLink = styled(HoverLink)`
  font-size: 1.3rem;
  margin: 0 15px;
  font-weight: 500;
`

export default function Navbar() {
  return (
    <NavContainer >
      <Logo href="/">칸지칸자</Logo>
      <div className={style.leftMenu}>
        <MenuLink href="/">홈</MenuLink>
      </div>
      <div className={style.rightMenu}>
        <MenuLink href="/login">로그인</MenuLink>
      </div>
    </NavContainer>
  );
}
