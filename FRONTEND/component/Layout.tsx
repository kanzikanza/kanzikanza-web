import React from 'react';
import { styled, Container, Card } from '@mui/material';
import Navbar from './Navbar';

const CustomContainer = styled("div")`
  min-height: 500px ;
  padding: 20px;
  border: 2px solid orange;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
`

// //   최소 1920x960으로 제작해야 잘리는 부분이 생기지 않음
// const CustomBackground = styled('div')`
//   background-attachment: fixed;
//   background: linear-gradient(to bottom, white 50%, beige);
//   width: 100%;
//   height: 100%;
// `

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container>
        <CustomContainer>
          {children}
        </CustomContainer>
      </Container>
    </>
  );
};

export default Layout;
