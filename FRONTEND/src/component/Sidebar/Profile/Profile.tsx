import React, { useState } from 'react';
import { Avatar, Typography, TextField, Box, styled } from '@mui/material';

function Profile() {
  const [name, setName] = useState('김삳갓');
  const [image, setImage] = useState('https://via.placeholder.com/100');

    
const ProfileIndex = styled('Box')`
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height : 1rem;
    width : 8rem;
    border-radius : 1rem;
    padding : 1.5rem;
    background-color : #FFF7EE
`
    
const handleImageChange = (e) => { }
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
      <Avatar
        src={image}
        alt="Profile"
        sx={{ width: '2rem', height: '2rem', cursor: 'pointer' }}
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
