'use client'
import { useRef, useEffect, useState } from "react";
import * as StompJs  from "@stomp/stompjs"
import { subscribe } from "diagnostics_channel";
import  axios from 'axios'
import { json } from "stream/consumers";
import '@/app/globals.css'
import { randomInt } from "crypto";

type kanza = {
    kanza: string
    mean: string
    sound : string
}

export default function Test() {
    const [kanzas, setKanzas] = useState<kanza[]>([])
    const [index, setIndex] = useState<number>(0)
    const [inputValue, setInputValue] = useState("");
    const [isEnd, setIsEnd] = useState<boolean>(false);
 
    const HowMany = useRef<number>(0)
    const QuestionType = useRef<number> (0)
    
    const handleKeyDown = (event) => {
    // 만약 눌린 키가 Enter 키인지 확인
    if (event.key === "Enter") {
        // Enter 키가 눌렸을 때만 handleSubmit 함수 호출
        handleSubmit(event);
    }
    };

        const handleSubmit = (event) => {
            event.preventDefault(); // 기본 제출 동작 방지

            // 입력된 데이터를 가져와서 전송 또는 처리하는 코드를 추가할 수 있습니다.
            console.log("Submitted:", inputValue);
            // 여기서 데이터를 전송하거나 다른 작업을 수행할 수 있습니다.
            // 예를 들어, axios를 사용하여 데이터를 전송할 수 있습니다.

            // 제출 후에 입력 필드 초기화
            // QuestionType.current ? 
            if (!QuestionType.current)
            {
                if (inputValue == kanzas[index].mean)
                {
                    HowMany.current += 1
                }
                setIndex(prev => prev + 1)
            }
            else 
            {
                if (inputValue == kanzas[index].sound)
                {
                    HowMany.current += 1
                }
                setIndex(prev => prev + 1)
            }
            QuestionType.current = getRandomInt(0, 2)
            setInputValue("");
        }

        function getRandomInt(min : number, max : number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
        }
    
    useEffect(() => {
        // Use an arrow function for the asynchronous code
        const fetchData = async () => {
            try {
                // Use await for the asynchronous axios request
                const response = await axios.get('http://localhost:8080/kanzi/problem');
                
                // Access the data property of the response
                console.log(response.data.data);
                setKanzas(response.data.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        // Call the fetchData function
        fetchData();
    }, []); // Pas
    
    function goNext() {
        setIndex(prev => prev + 1)
    }
    return (
        <div className=" background frame-layout">
            <div className="card-page">
                <div>
                    <div className="flex">
                        {
                            isEnd ?
                                <div>

                                </div>
                                
                                
                                
                                :
                        <div>
                            <div className="w-1/2 flex content-center justify-center ">
                                {
                                    kanzas.length > 0 ?
                                        <p className="flex items-center content-center align-middle text-9xl color-font">{kanzas[index].kanza}</p>
                                        :
                                        null
                                }
                            </div>
                            
                            <div className="w-1/2 h-full">

                                    <div className="w-full flex content-center justify-center flex-col">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 h-1/5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${index/20 * 100}%`}}></div>
                                    </div>
                                        
                                    <p className="text-center text-3xl">다음 한자의 { QuestionType.current ? '뜻' : '음'}을 적으시오</p>
                                    <form className="w-full mx-auto" onSubmit={handleSubmit}>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="block p-2.5 w-full text-sm bg-background rounded-lg border border-gray-300 dark:bg-background dark:border-gray-600 dark:placeholder-gray-400 dark:text-font"
                                            placeholder="Leave a comment..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        ></textarea>
                                            <button className="button w-full" type="submit">제출</button>
                                    </form>
                            </div>
                        </div>
                        </div>
                        }
                </div>
            </div>
            </div>
        </div>
    )
}