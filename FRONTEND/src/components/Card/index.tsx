'use client'

import React from "react";
import * as styles from './index.css'

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({children}: CardProps) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}