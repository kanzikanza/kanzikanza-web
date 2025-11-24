import React, { useState } from "react";

const CARD_BG = "#FFF8F0"; // 기존 톤과 맞는 색상

export default function KanzaWrongCardSlider({ data, limit = 3 }) {
  // data: Array<{ kanzaLetter, kanzaSound, kanzaMean }>
  const [index, setIndex] = useState(0);

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, data.length - 1));

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* <SwipeableViews
        index={index}
        onChangeIndex={setIndex}
        enableMouseEvents
        style={{ minHeight: 300 }}
      > */}
        {data.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FFF8F0] border-2 border-[#DDA15E] rounded-[2rem] min-h-[300px] flex flex-col items-center justify-center shadow-lg mx-2 p-8"
          >
            <h2 className="text-6xl text-[#BC6C25] font-bold">
              {item.kanzaLetter}
            </h2>
            <h5 className="text-2xl mt-4 text-[#BC6C25]">
              {item.kanzaSound}
            </h5>
            <p className="text-base mt-2 text-[#333]">
              {item.kanzaMean}
            </p>
          </div>
        ))}
      {/* </SwipeableViews> */}
      <div className="flex justify-center mt-4 gap-4">
        <button 
          onClick={handlePrev} 
          disabled={index === 0} 
          className="bg-[#FFCC99] text-[#333] px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB366] transition-colors"
        >
          ←
        </button>
        <button 
          onClick={handleNext} 
          disabled={index === data.length - 1} 
          className="bg-[#FFCC99] text-[#333] px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB366] transition-colors"
        >
          →
        </button>
      </div>
      <p className="text-center mt-2 text-[#BC6C25]">
        {index + 1} / {data.length}
      </p>
    </div>
  );
} 