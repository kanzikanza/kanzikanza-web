import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] backdrop-blur-[5px] bg-black/30 flex items-center justify-center"
      id='NoWay'
    >
      <div className={`relative transition-opacity duration-300 ${showSpinner ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-[60px] h-[60px] border-[4px] border-white border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default LoadingScreen;



// import { useEffect, useState } from 'react';

// const LoadingScreen = () => {
//   const [showSpinner, setShowSpinner] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSpinner(true);
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div style={overlayStyle}>
//       {showSpinner && <div style={spinnerStyle} />}
//     </div>
//   );
// };

// // 스타일 객체
// const overlayStyle: React.CSSProperties = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   width: '100vw',
//   height: '100vh',
//   backdropFilter: 'blur(5px)',
//   backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   zIndex: 9999
// };

// const spinnerStyle: React.CSSProperties = {
//   border: '6px solid rgba(255, 255, 255, 0.3)',
//   borderTop: '6px solid #ffffff',
//   borderRadius: '50%',
//   width: '60px',
//   height: '60px',
//   animation: 'spin 1s linear infinite'
// };

// // 전역 CSS (index.css 등에 추가)
// const globalStyles = `
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
// `;

// export default LoadingScreen;
