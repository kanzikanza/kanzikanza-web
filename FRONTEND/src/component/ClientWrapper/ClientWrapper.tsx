// app/ClientWrapper.tsx
'use client';

import { AppProvider } from '../AppContext/AppContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    return (
        <AppProvider>
            <div className={`flex ${isAuthenticated ? 'flex-row' : 'flex-col'}`}>
                { isAuthenticated ?
                    <Sidebar />
                    :
                    <div className="flex-grow">
                        <Navbar />
                    </div>  
                }
            
                <div className="flex-grow flex items-center flex-col justify-center p-auto">
                    <div className="m-8">    
                        {children}
                    </div>
                </div>
            </div>
        </AppProvider>
    );
}
