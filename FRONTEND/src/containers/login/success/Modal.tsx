'use client'
import React from 'react';
import { useEffect } from 'react';




const styles: Record<string, React.CSSProperties>  = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 검은색 반투명 배경
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // 다른 요소 위에 표시
  },
  modal: {
    width: '300px',
    height: '200px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  spinner: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '5px solid #f3f3f3', // 회색 라인
    borderTop: '5px solid #3498db', // 파란색 라인
    animation: 'spin 1s linear infinite', // 회전 애니메이션
  },
  text: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
  },
};

export default function Modal({ isOpen } : any) {
    useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `);
    }
    }, []);
    
    if (!isOpen) return null;


    return (
                <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={styles.spinner}></div>
                    <p style={styles.text}>로딩 중...</p>
                </div>
                </div>
        );
};