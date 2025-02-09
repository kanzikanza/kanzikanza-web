// app/context/AppContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
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
  return useContext(AppContext);
}
