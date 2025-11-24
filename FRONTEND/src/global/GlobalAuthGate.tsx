'use client'
import React, { useEffect, useState, Suspense} from "react";
import LoadingScreen from "./globalLoading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function AuthGate({children} : Readonly<{
  children: React.ReactElement;
}>) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    
    useEffect(() => {
        // Context에서 이미 인증을 체크했으므로, 여기서는 결과만 확인
        if (!isLoading && !isAuthenticated) {
            console.log("🚫 AuthGate: 인증되지 않음, /landing으로 이동");
            router.push("/landing");
        }
    }, [isAuthenticated, isLoading, router]);
    
    // 로딩 중이거나 인증되지 않았으면 로딩 화면 표시
    if (isLoading || !isAuthenticated) {
        return <LoadingScreen />;
    }
    
    return (
        <div>
            {!isAnswered ? <LoadingScreen /> : <></>}
            <Suspense>
                <div id="ModalContainer">
                    {React.cloneElement(children, { isAnswered, setIsAnswered })}
                </div>
            </Suspense>
        </div>
    );
}