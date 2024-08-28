'use client'

import React from "react";

import * as styles from './index.css';
import { plainLine } from "@/styles/common.css";

export default function VerticalNavbar() {
  return (
    <div className={styles.verticalContainer}>
      <div>칸지칸자</div>
      <hr className={plainLine} />
      <div>시험 보기</div>
      <div>복습하기</div>
    </div>
  );
}