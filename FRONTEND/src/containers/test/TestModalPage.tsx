'use client'
import { BaseModal } from "@/component/Modal/BaseModal";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";


const fetchData = (url: string, isToken: boolean) => {

        return axios.get(url,
            {
                    headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
            })
            let response: any[] = []
            if (!response ) {
                throw "response doesn't have val"
            }
            // console.log(response);
            response = response.map((x) => x[1])
            // setKanzas(response);
};

export function PreCheckModal({ children, isAnswered, setIsAnswered } : {children : React.ReactElement, isAnswered : null | boolean, setIsAnswered : null | any}
) {
    const [answerState, setAnswerState] = useState(false);
    const [innerIsAnswer, setInnerIsAnswer] = useState(false);
    const [needModal, setNeedModal] = useState(false);
    const searchParams = useSearchParams()
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    const levels : number = Number(searchParams.get('levels'))
    const days : number = Number( searchParams.get('days'))
    
    const url = useRef<string>("")
    useEffect(() => { 
        if (innerIsAnswer == false) 
            return 
        url.current = answerState == false ? NEXT_PUBLIC_SERVER_IP + `/kanzi/getNewTestProblems?levels=${levels}&days=${days}` : NEXT_PUBLIC_SERVER_IP + `/kanzi/getExistingSession?levels=${levels}&days=${days}`
        setIsAnswered(true)
    }, [innerIsAnswer, answerState, setIsAnswered, NEXT_PUBLIC_SERVER_IP])

    useEffect(() => { 
        axios.get(NEXT_PUBLIC_SERVER_IP + `/kanzi/getSessionExisted?levels=${levels}&days=${days}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, }
            }
        )
            .then((response) => {
                console.log(response)
                if (response.data[1].sessionExisted == false)
                {
                    url.current =NEXT_PUBLIC_SERVER_IP + `/kanzi/getNewTestProblems?levels=${levels}&days=${days}`
                    setIsAnswered(true)
                }
                else
                {
                    setNeedModal(true)
                }
            }).catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        isAnswered ?
        <>
            {React.cloneElement(children, { url : url.current })}
        </>
            :
        <div
            id="ModalInnerContainer"
        >
            {
                needModal ?
                <BaseModal
                    isAnswered={innerIsAnswer}
                    setIsAnswered={setInnerIsAnswer}
                    answerState={answerState}
                    setAnswerState={setAnswerState}
                />
                :
                <></>
            }
        </div>
    )
}