// 'use client'
// import { useEffect, useState } from "react";
// // import  '@/global/globalLoading'
// import LoadingScreen from "./globalLoading";
// // 공통 로직을 처리하는 HOC



// const withInitialization = (WrappedComponent: React.FC) => {
    
//   return (props : any) => {
//       const [isLoading, setIsLoading] = useState<boolean>(true);
      
//       useEffect(() => {
//       const initialize = async () => {
//         // 세션 스토리지 조회
//         const sessionData = sessionStorage.getItem('key');
        
//         // API 호출
//         await fetch('/api/init');
        
//         setIsLoading(false);
//       };
//       initialize();
//     }, []);

//     return isLoading ? <LoadingScreen /> : <WrappedComponent {...props} />;
//   };
// };

// export default withInitialization

// // 사용 예시
// // export default withInitialization(HomePage);
'use client';

import { useEffect, useState, ComponentType } from "react";
import LoadingScreen from "./globalLoading";

// 타입 안전성 강화 버전
const withInitialization = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const EnhancedComponent = (props: P) => {
    const [isLoading, setIsLoading] = useState<boolean>(true); // Boolean → boolean

    useEffect(() => {
      const controller = new AbortController();

      const initialize = async () => {
        try {
          sessionStorage.getItem('key');
          await fetch('/api/init', { signal: controller.signal });
        } finally {
          setIsLoading(false);
        }
      };

      initialize();
      return () => controller.abort();
    }, []);

    return isLoading ? <LoadingScreen /> : <WrappedComponent {...props} />;
  };

  // displayName 설정 (디버깅 용이성)
  EnhancedComponent.displayName = `withInitialization(${WrappedComponent.displayName || WrappedComponent.name})`;

  return EnhancedComponent;
};

export default withInitialization; // 명시적인 default export
