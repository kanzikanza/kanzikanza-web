import React from 'react';
import * as styles from './index.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftMenu}>
        <a href="/" className={styles.menuLink}>한자, 한 자</a>
        {/* <a href="/exam" className={style.menuLink}>시험 보기</a> */}
      </div>
      <div className={styles.rightMenu}>
        <a href="/login" className={styles.menuLink}>로그인</a>
      </div>
    </nav>
  );
}
