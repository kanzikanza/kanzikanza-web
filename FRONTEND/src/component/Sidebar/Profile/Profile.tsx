import React, { useEffect, useState } from 'react';

import { createObject, getImageFromIndexedDB } from '@/global/globalFunction';
import Image from 'next/image';


const customImgLoader = ({ src }) => {
      return `${src}`
}

function Profile(
  props : {userNickName: String,
  userProfileIndex: Number}
) {
  const [name, setName] = useState<String>('');
  const [image, setImage] = useState<any>('');

    
  useEffect(() => { 
    setName(props.userNickName)

    if (props.userProfileIndex !== -1)
    {

      let db : any = null
      const request = indexedDB.open("profile", 2);
      request.onupgradeneeded = e => {
        db = request.result
        db.createObjectStore("profile", {autoIncrement: true})
      }
      request.onsuccess = e => {
        db = request.result
        const arg: IDBRequest = getImageFromIndexedDB(db)
        arg.onsuccess = (event: any) => {
          let imgFile = event.target.result;
          
          // imgFile이 Blob 또는 File 객체인지 확인
          if (imgFile && imgFile instanceof Blob) {
            const objURL = URL.createObjectURL(imgFile)
            setImage(objURL)
          } else if (typeof imgFile === 'string') {
            // 이미 URL 문자열인 경우
            setImage(imgFile)
          } else {
            // 데이터가 없거나 올바르지 않은 경우, 기본 이미지 로드
            createObject(db, require(`@/assets/profile-images/User_${props.userProfileIndex}.png`).default.src)
          }
        }
        
        arg.onerror = () => {
          // 에러 발생 시 기본 이미지 로드
          createObject(db, require(`@/assets/profile-images/User_${props.userProfileIndex}.png`).default.src)
        }
      }

      request.onerror = e => {
        alert("error is called");
        db = null
      }
      
    }
  }, [props.userNickName])

  const handleImageChange = (e : any) => { }
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

    
  return (
    <div className="flex-row flex justify-between items-center h-8 w-40 rounded-2xl p-6 bg-[#FEF7EF] transition-all duration-300 cursor-pointer hover:bg-[#FFE4D4] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm">
      {
        image
         ?
        <img
          src={image}
          alt="Profile"
          className="h-12 w-12 rounded-full mr-2.5 transition-transform duration-300 hover:scale-105"
          // onClick={() => document.getElementById('fileInput')?.click()}
        /> :
        <></>
      }
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      <h6 className="text-xl font-medium transition-colors duration-300 hover:text-[#F17F42]">
        {name}
      </h6>
    </div>
  );
}

export default Profile;
