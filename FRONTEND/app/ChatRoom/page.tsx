'use client'
import React from "react";
import "./page.css"
import { useRef, useEffect } from "react";
import * as StompJs  from "@stomp/stompjs"
import { subscribe } from "diagnostics_channel";

interface Role {
    id: number;
    roleId: number;
}
export default function App() {
    const client = useRef<any>({});
    // 클라이언트 
    const roomId : number = 1;
    
    function onMessageReceived (message : StompJs.Message) {
        const messageBody = JSON.parse(message.body);
        console.log(messageBody)

    }
    useEffect(() => {
        // 시작할 때 웨이팅 룸으로 들어가게 하는 놈
        const subscribe = () => {
            client.current.subscribe(`/sub/channel/${roomId}`, onMessageReceived)
            }
        // console.log('아랄랄랄')
            
        function publishOnWait() {
            client.current.publish({
                destination : `/pub/room/${roomId}`,
                body : JSON.stringify({
                    id : 1,
                    roleId : 1  
                })
            })
        }   

        
        
            // function subscribe() {}
        
            // 커넥트 함수 /*
        const connect = () => {

            client.current = new StompJs.Client({
                brokerURL: "ws://localhost:8080/ws",
                onConnect : () => {
                    console.log("connected");
                    subscribe();
                    publishOnWait();
                },
                onDisconnect : () => {
                    console.log("failed to connect");
                }
            })
            client.current.activate()
        // 생명주기 처음단계에서 connect 호출 
        
        }
        connect();
    }, [roomId])
    
    
    //

    

    return (
        <div>
            <div className={`flex grid grid-cols-2 gap-4`}>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            <div className="flex">
                <button type="button" className="button_class">Default</button>
            </div>
            
            
            
        </div>

        </div>
    )
}