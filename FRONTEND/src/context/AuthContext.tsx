'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthorityChain } from '@/global/globalFunction';
import useAuthStore from '@/store/useStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const checkAuth = async () => {
    // 이미 체크 중이면 대기
    if (hasChecked) {
      return isAuthenticated;
    }

    setHasChecked(true);
    setIsLoading(true);
    
    try {
      console.log('🔐 AuthContext: 인증 체크 시작');
      const result = await checkAuthorityChain();
      console.log('🔐 AuthContext: 인증 결과', result);
      setIsAuthenticated(result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('🔐 AuthContext: 인증 실패', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    // 초기 마운트 시 한 번만 체크
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

