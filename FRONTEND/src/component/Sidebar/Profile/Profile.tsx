import React, { useEffect, useState } from 'react';

import { Avatar, Typography, TextField, Box, styled } from '@mui/material';
import { createObject, getImageFromIndexedDB } from '@/global/globalFunction';
import Image from 'next/image';


const customImgLoader = ({ src }) => {
      return `${src}`
}

const ProfileIndex = styled(Box)`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  width: 10rem;
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: #FEF7EF;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: #FFE4D4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileImage = styled('img')`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  margin-right: 10px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileName = styled(Typography)`
  transition: color 0.3s ease;
  
  &:hover {
    color: #F17F42;
  }
`;

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
          setImage(imgFile)
        }
        
        arg.onerror = () => {
          createObject(db, require(`@/assets/profile-images/User_${props.userProfileIndex}.png`).default.src)
        }
        const nextArg : IDBRequest= getImageFromIndexedDB(db)
        nextArg.onsuccess = (event: any) => {
          let imgFile = event.target.result;
          const objURL = URL.createObjectURL(imgFile)
          setImage(objURL)
        }
        nextArg.onerror = (event: any) => {
          setImage('')
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
    <ProfileIndex>
      {
        image
         ?
        <ProfileImage
          src={image}
          alt="Profile"
          // onClick={() => document.getElementById('fileInput')?.click()}
        /> :
        <></>
      }
      <input
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <ProfileName variant="h6">
        {name}
      </ProfileName>
      {/* <TextField
        variant="outlined"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 입력"
        sx={{ marginTop: 1 }}
      /> */}
    </ProfileIndex>
  );
}

export default Profile;
