import React from 'react';
import { styled, Container, Card } from '@mui/material';
import Navbar from './Navbar';

const CustomContainer = styled("div")`
  min-height: 500px ;
  padding: 20px;
  border: 2px solid orange;
  border-radius: 10px;
`

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container>
        <CustomContainer>
          {children}
        </CustomContainer>
      </Container>
    </div>
  );
};

export default Layout;
