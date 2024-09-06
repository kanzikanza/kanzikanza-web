'use client'

import React from "react";

import * as styles from './index.css';
import { pageMiniTitle } from "@/styles/common.css";

export default function DayList() {
  return (
    <div>
      <hr />
      <p className={pageMiniTitle}>9급</p>
      <hr />
      <p className={pageMiniTitle}>8급</p>
      <hr />
    </div>
  );
}