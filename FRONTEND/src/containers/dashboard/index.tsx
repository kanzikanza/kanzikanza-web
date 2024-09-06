'use client'

import React from "react";

import StreakCard from "./StreakCard";
import * as styles from './index.css';
import DayList from "./DayList";

export default function Dashboard() {
  return (
    <div className={styles.DashboardContainer}>
      <StreakCard />
      <DayList />
    </div>
  );
}