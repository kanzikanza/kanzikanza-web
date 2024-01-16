'use client'
import { useState, useEffect } from "react"
import Leftcontainer from "./leftcontainer"
import Rightcontainer from "./rightcontainer"



function containers() {
    
}    

export default function bottomcontainer(){
    // let left : number = 5;
    // let right : number = 5;
    // useEffect(() => {
        
        // }, [left, right])
        const [left, setLeft] = useState(6)
        const [right, setRight] = useState(6)
        
        const increaseLeft = () => {
            setLeft(a => a++);
            setRight(a => a--);
        
        }
        const increaseRight = () => {
            setRight(a => a++);
            setLeft(a => a--);
        }
    return (
        <div>
        <p>
        <button type="button" onClick={increaseRight} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">-</button>
        <button type="button" onClick={increaseLeft} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">+</button>
        </p>
        <div className="flex">

        <Leftcontainer
            size = {left}
        />
        <Rightcontainer 
            size = {right}
        />
        </div>
        </div>
    )
}