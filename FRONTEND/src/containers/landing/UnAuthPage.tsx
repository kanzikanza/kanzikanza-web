'use client'
import React, { useEffect, useState } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Frame from '@/public/landing/Frame.png'
import Frame2 from '@/public/landing/Frame2.png'
import Frame3 from '@/public/landing/Frame3.png'
import Image, { StaticImageData } from 'next/image';
import { keyframes, minHeight } from '@mui/system';
import { nextImage } from '@/global/globalComponent';
// 인터페이스 정의
interface VerticalCarouselProps {
  // 필요한 경우 props 추가
}

const ArrowButton = styled(IconButton)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
});

// 애니메이션 정의
const slideUp = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const slideOutUp = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
`;

// 스타일 컴포넌트 정의
const CarouselContainer = styled(Box)({
  display: 'flex',
  flexGrow : 1,
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '100%',
  height: '85vh',
  width: '90vw',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
});

const ImageContainer = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
});

const CarouselImageWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  animation: `${slideUp} 1s ${theme.transitions.easing.easeInOut} forwards`,
}));

const PreviousImageWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  animation: `${slideOutUp} 1s ${theme.transitions.easing.easeInOut} forwards`,
}));



const VerticalCarousel: React.FC<VerticalCarouselProps> = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  // 이미지 배열 정의 - 타입 명확하게 작성
  const images: StaticImageData[]  = [Frame, Frame2, Frame3];
  console.log(Frame)
  const interval = 3000;

  // 다음 이미지로 이동
  const handleNext = () => {
    setPreviousIndex(currentIndex);
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };

  // 자동 슬라이드 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 === images.length ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, currentIndex, interval]);

  return (
    <CarouselContainer>
      <ImageContainer className='what'>
        {images.map((source, index) => {
          if (index === previousIndex)
          {
            return (
              <PreviousImageWrapper
                key={index}
              > 
              <Image
                  fill={true}
                  src={images[previousIndex]}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`슬라이드 ${previousIndex + 1}`}
              />
            </PreviousImageWrapper>
            )
          }
          else if (index === currentIndex)
          {
            return (
              <CarouselImageWrapper
                key={index}
              >
                <Image
                  fill
                  src={images[currentIndex]}
                  // sizes="height: '100%' width: '100%'"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                  alt={`슬라이드 ${currentIndex + 1}`}
                />
              </CarouselImageWrapper>
            )
          }
          else
          {
            return null
          }
        }  
        )}
      </ImageContainer>
      <ArrowButton onClick={handleNext} aria-label="다음 이미지">
        <KeyboardArrowDownIcon />
      </ArrowButton>
    </CarouselContainer>
  );
};

export default VerticalCarousel;
