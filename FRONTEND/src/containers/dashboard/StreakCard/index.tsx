'use client'

import React, { useState } from "react";
import Card from "@/components/Card";
import Image from "next/image";
import fireIcon from "#/images/fire_icon.png";

import * as styles from './index.css';

export default function StreakCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.StreakContainer}
    >
      {/* Streak 카드 */}
      <Card>
        <div className={styles.StreakText}>
          <Image src={fireIcon} alt="불 아이콘" width={30} height={30} />
          627일째 도전 중  
        </div>
      </Card>

      {isHovered && (
        <Card className={styles.StreakCalendar}>
          <div >
            S M T W T F S
          </div>
        </Card>
      )}
    </div>
  );
}
