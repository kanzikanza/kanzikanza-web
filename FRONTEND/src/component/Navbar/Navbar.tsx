import React from 'react';
import './navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="left-menu">
        <a href="/" className="menu-link">홈</a>
        <a href="/exam" className="menu-link">시험 보기</a>
      </div>
      <div className="right-menu">
        <a href="/login" className="menu-link">로그인</a>
      </div>
    </nav>
  );
}
