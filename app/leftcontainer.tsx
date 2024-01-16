'use client'
import React from "react"
import {useEffect} from 'react';


export default function leftcontainer(props : { size : number }) {
    let val : number = props.size;

    let denominator : number = 12;
    useEffect(() => {
        // props.someProp가 변경되었을 때 실행되는 코드
        console.log('Props 변경 감지:', props.size);
    
        // 여기에 추가적인 동작을 수행할 수 있습니다.
      }, [props.size]);

    return (
        <div className={`w-${val}/12 h-52` }>
        {/* <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 max-w-${val}/12`}>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg" alt="" />
            </div>
        </div> */}
        </div>
        )
}