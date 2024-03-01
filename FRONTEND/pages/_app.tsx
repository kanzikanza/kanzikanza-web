import '../styles/globals.css';
import { styled } from '@mui/material';

const CustomBackground = styled('div')`
  background-attachment: fixed;
  background: linear-gradient(to bottom, white 50%, beige);
  width: 100%;
  height: 900px;
`

function MyApp({ Component, pageProps }) {
  return (
    <CustomBackground>
      <Component {...pageProps} />;
    </CustomBackground>
  )
  
}

export default MyApp;
