'use client'

import React from "react";

import * as styles from './index.css';
import { plainLine } from "@/styles/common.css";

export default function VerticalNavbar() {
  return (
    <div className={styles.verticalContainer}>
      <a href="/dashboard" className={styles.menuLink}>한자, 한 자</a>
      <hr className={plainLine} />
      <a href="/exam" className={styles.menuLink}>시험 보기</a>
      <a href="/review" className={styles.menuLink}>복습</a>
    </div>
  );
}