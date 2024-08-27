'use client'

import React, { useState } from 'react';
import * as styles from './index.css';
import { BsChevronCompactDown } from "react-icons/bs";

export default function Main() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sections = [
    "하루 5분, 칸지칸자에서 한자를 학습해 보세요!",
    "재미있고 쉬운 한자 학습",
    "카카오톡으로 간편하게 가입하기!",
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sections.length);
  };

  return (
    <div className={styles.container}>
      {sections.map((text, index) => (
        <div
          key={index}
          className={styles.section}
          style={{ transform: `translateY(-${currentSlide * 100}%)` }}
        >
          {text}
        </div>
      ))}
      <BsChevronCompactDown 
        className={styles.button} 
        onClick={handleNextSlide}
        size={50}
      />
    </div>
  );
}