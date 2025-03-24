// app/ClientWrapper.tsx
'use client';

import { AppProvider } from '../AppContext/AppContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { checkAuthority } from '@/global/globalFunction';
import { styled } from '@mui/material/';



const ChildContainer = styled('div')`

  margin: 2rem;

  // height: 100vh;
`;
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    let initState : boolean = localStorage.getItem('accessToken') === null
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initState) 

    useEffect(() => {
    // URL 변경 시 API 호출
    console.log(`Navigated to: ${pathname}`);
    // 예: 토큰 검증 API 호출
    // 나중에 여기에 authenticated인지를 확인하는 절차를 넣음.
    
        try {
            // 여기선 checkAuthority가 promise를 반환하기 때문에 then과 catch와 상관없이 먼저 렌더링이 진행된다, 이건 막을 수 없다.
            checkAuthority().then(
                response => {
                    console.log('authentictate success')
                    setIsAuthenticated(true)
                }
            ).catch(
                error => {
                    console.log('authentictate failed')
                    setIsAuthenticated(false)
                }
            )
        } catch
        {
            console.log('authentictate failed')
            setIsAuthenticated(false)
        }
        // setIsAuthenticated(true)
  }, [pathname]);


  return (
      <AppProvider>
          <div style={{ display: 'flex' , flexDirection : isAuthenticated ? 'row' : 'column'}}>
          { isAuthenticated ?
            <Sidebar />
            :
            <div style={{ flexGrow: 1, }}>
            <Navbar />
            </div>  
          }
        
        <div style={{ flexGrow: 1,  alignItems: 'center', flexDirection :'column', padding:'auto'}}>
            <ChildContainer>    
                {children}
            </ChildContainer>
        </div>
      </div>
    </AppProvider>
  );
}
