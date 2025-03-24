import { useContext } from "react";
import { LoginContext } from "@/context/LoginContext";


export function LoginHook() {
    const context = useContext(LoginContext)

    if (context === null)
    {
        throw('에러 발생')
    }
    return context
}