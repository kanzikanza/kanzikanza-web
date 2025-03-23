// app/context/AppContext.tsx
'use client';

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface AppState {
  user: string;
  isAuthenticated: boolean;
}
interface AppContextType {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}


const defaultState: AppState = {
  user: 'Guest',
  isAuthenticated: false,
};

// const AppContext = createContext<AppContextType | null>(null);
// const AppContext = createContext<AppContextType | null>(null); 
const AppContext = createContext<any>({
  state: defaultState,
  setState: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: 'Guest',
    isAuthenticated: false,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;

}
