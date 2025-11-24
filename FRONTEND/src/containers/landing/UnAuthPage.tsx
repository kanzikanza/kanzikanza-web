'use client'
import React, { useEffect, useState } from 'react';
// MUI removed
import Frame from '@/public/landing/Frame.png'
import Frame2 from '@/public/landing/Frame2.png'
import Frame3 from '@/public/landing/Frame3.png'
import Image, { StaticImageData } from 'next/image';
import { nextImage } from '@/global/globalComponent';
// 인터페이스 정의
interface VerticalCarouselProps {
  // 필요한 경우 props 추가
}



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
    <div className="flex flex-grow flex-col items-center max-w-full h-[85vh] w-[90vw] mx-auto relative overflow-hidden">
      <div className="what w-full h-full relative">
        {images.map((source, index) => {
          if (index === previousIndex)
          {
            return (
              <div
                key={index}
                className="w-full h-full absolute top-0 left-0 animate-[slideOutUp_1s_ease-in-out_forwards]"
              > 
              <Image
                  fill={true}
                  src={images[previousIndex]}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`슬라이드 ${previousIndex + 1}`}
              />
            </div>
            )
          }
          else if (index === currentIndex)
          {
            return (
              <div
                key={index}
                className="w-full h-full absolute top-0 left-0 animate-[slideUp_1s_ease-in-out_forwards]"
              >
                <Image
                  fill
                  src={images[currentIndex]}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt={`슬라이드 ${currentIndex + 1}`}
                />
              </div>
            )
          }
          else
          {
            return null
          }
        }  
        )}
      </div>
      <button 
        onClick={handleNext} 
        aria-label="다음 이미지"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default VerticalCarousel;
