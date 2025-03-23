// app/context/AppContext.tsx
'use client';

// import { createContext, useContext, useState } from 'react';

// const AppContext = createContext(null);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [state, setState] = useState({
//     user: 'Guest',
//     isAuthenticated: false,
//   });

//   return (
//     <AppContext.Provider value={{ state, setState }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useAppContext() {
//   return useContext(AppContext);
// }

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

// ✅ 타입 명시 + 초기값 제공
const AppContext = createContext<AppContextType>({
  state: { user: 'Guest', isAuthenticated: false },
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

// ✅ null 체크 제거
export function useAppContext() {
  return useContext(AppContext);
}
