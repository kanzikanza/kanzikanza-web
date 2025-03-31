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
import { checkAuthorityChain } from "./globalFunction";
import { useRouter } from 'next/navigation';
import LocalStorage  from '@/global/globalStorage'


type optionalFunction = | {new () : void} | null
// 타입 안전성 강화 버전
const withInitialization = <P extends object>(
  WrappedComponent: ComponentType<P>,
  func: optionalFunction = null
) => {
  const EnhancedComponent = (props: P) => {
    let initState = LocalStorage.getItem('accessToken') === null
    const [isLoading, setIsLoading] = useState<boolean>(true); // Boolean → boolean
    const [isAuth, setIsAuth] = useState<boolean>(initState)
    const router = useRouter()
    
    useEffect(() => {
      const controller = new AbortController();
      checkAuthorityChain()
        .then((result: boolean) => {
          console.log('api come', result)
          setIsLoading(false)
          setIsAuth(result)
        })
      
      if (func !== null)
      {
        const arg = new func();        
      }
      
      return () => controller.abort();
    }, []);

    useEffect(() => {
      if (router === null) return 
      console.log(isLoading, ' ', isAuth)
      if (isLoading === false && isAuth === false)
      {
        router.push("/landing")
      }
    }, [isAuth, router])

    return isLoading ? <LoadingScreen /> : <WrappedComponent {...props} />;
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


