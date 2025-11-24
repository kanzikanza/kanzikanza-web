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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import LocalStorage  from '@/global/globalStorage'
import { ReactNode } from "react";
import { BaseModal } from "@/component/Modal/BaseModal";
type optionalFunction = React.ReactNode | null


// 타입 안전성 강화 버전
const withInitialization = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const EnhancedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isAnswered, setIsAnswered] = useState<boolean | null>(true);
    const [answerState, setAnswerState] = useState<boolean>(false);
    const router = useRouter()
    
    useEffect(() => {
      // AuthContext에서 이미 인증을 처리하므로 여기서는 추가 호출 불필요
      console.log("withInitialization: 인증 상태 확인", isAuthenticated, isLoading);
    }, [isAuthenticated, isLoading]);

    useEffect(() => {
      if (router === null) return 
      console.log("withInitialization:", isLoading, isAuthenticated)
      if (isLoading === false && isAuthenticated === false)
      {
        router.push("/landing")
      }
    }, [isAuthenticated, isLoading, router])

    return isLoading || (!isAnswered)?
      <LoadingScreen/>
      : <WrappedComponent {...props} />;
  };

  // displayName 설정 (디버깅 용이성)
  EnhancedComponent.displayName = `withInitialization(${WrappedComponent.displayName || WrappedComponent.name})`;

  return EnhancedComponent;
};
export type nextImage = {
    src: string,
    height: number,
    width: number,
    blurDataURL: string,
    blurWidth : number,
    blurHeight: number
}

export default withInitialization; // 명시적인 default export


