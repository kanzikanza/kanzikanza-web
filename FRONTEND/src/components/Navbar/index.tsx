import React from 'react';
import * as styles from './index.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftMenu}>
        <a href="/" className={styles.menuLink}>한자, 한 자</a>
        {/* 임시 링크 */}
        <a href="/dashboard" className={styles.menuLink}>대시보드</a>
        <a href="/exam" className={styles.menuLink}>시험보기</a>
      </div>
      <div className={styles.rightMenu}>
        <a href="/login" className={styles.menuLink}>로그인</a>
      </div>
    </nav>
  );
}
