import React from 'react';
import styles from './SmallButton.module.css';  // 스타일 시트 불러오기

const SmallButton: React.FC<{ onClick: () => void }> = ({ onClick, children }) => {
  return (
    <button
      className={styles.button}  // 스타일 클래스 적용
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SmallButton;