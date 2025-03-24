import React, { useEffect, useState } from 'react';

import { Avatar, Typography, TextField, Box, styled } from '@mui/material';
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
  const [image, setImage] = useState<any>('https://via.placeholder.com/100');

    
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
        console.log(request)
        db = request.result
        const arg: IDBRequest = getImageFromIndexedDB(db)
        arg.onsuccess = (event: any) => {
          let imgFile = event.target.result;
          setImage(imgFile)
        }
        
        arg.onerror
        {
          createObject(db, require(`@/assets/profile-images/User_${props.userProfileIndex}.png`).default.src)
        }
        const nextArg : IDBRequest= getImageFromIndexedDB(db)
        nextArg.onsuccess = (event: any) => {
          let imgFile = event.target.result;
          const objURL = URL.createObjectURL(imgFile)
          setImage(objURL)
        }
        nextArg.onerror = (event: any) => {
          setImage('https://via.placeholder.com/100')
        }
      }

      request.onerror = e => {
        alert("error is called");
        db = null
      }
      
    }
  }, [props.userNickName])
const ProfileIndex = styled(Box)`
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height : 2rem;
    width : 10rem;
    border-radius : 1rem;
    padding : 1.5rem;
    background-color : #FEF7EF
`
    
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
      {/* <Image
        loader={customImgLoader}
        src={image}
        alt="Profile"
        width={20}
        height={20}
        style={{height :'2rem', width : '2rem', cursor: 'pointer'}}
        // sx={{ width: '2rem', height: '2rem', cursor: 'pointer' }}
        // onClick={() => document.getElementById('fileInput').click()}
      /> */}
      <img
        src={image}
        alt="Profile"
        style={{height :'3rem', width : '3rem', cursor: 'pointer', borderRadius: '50%', marginRight: '10px'}}
        // sx={{ width: '2rem', height: '2rem', cursor: 'pointer' }}
        // onClick={() => document.getElementById('fileInput').click()}
      />
      <input
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <Typography variant="h6"  style={{alignItems : 'center'}}>{name}</Typography>
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
