'use client'
import React, { useEffect, useState } from "react";
import LoadingScreen from "./globalLoading";
import { checkAuthorityChain } from "./globalFunction";
import { useRouter } from "next/navigation";
// function BlurPage() {
//     return (

//     )
// }

export function AuthGate({children} : Readonly<{
  children: React.ReactElement;
}>) {
    const [isAuth, setIsAuth] = useState<boolean>(true)
    const router = useRouter()
    
    useEffect(() => {

        const response = checkAuthorityChain()
        response.then((res) => {
            console.log("checkAuthorityChain : then", res)
            if (res == false)
            {
                if (router === null) return 
                router.push("/landing")
            }
            else {
                setIsAuth(true)    
            }
        }).catch((res) => { 
            console.log("checkAuthorityChain : catch", res)
        })
    }, [])
    
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    return (
        <div>
            {!isAuth || !isAnswered ? <LoadingScreen /> : <></>}
            <div
            id="ModalContainer">
                {React.cloneElement(children, { isAnswered, setIsAnswered })}
            </div>
        </div>
    )
    if (!isAuth || !isAnswered) return (<LoadingScreen/>)
    return React.cloneElement(children, { isAnswered, setIsAnswered});

}