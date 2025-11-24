import React from "react";

export type kanza = {
  kanza: string;
  mean: string;
  sound: string;
}

const CongratulationModal: React.FC<{ open: boolean; onClose: () => void; score: any; reviews : kanza[] }> = ({ open, onClose, score, reviews}) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] min-h-[400px] text-center outline-none"
      >
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat -z-10"
          style={{ backgroundImage: "url('../assets/sticky-note.png')" }}
        />
        <button 
          onClick={onClose}
          className="flex items-end mt-4 mr-4 ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
  
        {score === -1 ? (
          <div className="z-[1001] px-12 py-5 pb-16">
            <p>점수를 계산 중입니다... </p>
            <p>잠시만 기다려 주세요 👩‍🦰</p>
            <div className="inline-block mt-4 w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="z-[1001] px-12 py-5 pb-16">    
            <p className="score">당신은 <strong>{score}</strong>점 입니다!</p>
            {reviews.length > 0 && (
              <>
                <strong className="block mb-1 mt-4">틀린 문제</strong>
                <div className="max-h-[200px] overflow-y-auto">
                  {reviews.map((review, index) => (
                    <div key={index} className="p-1 last:border-b-0">
                      {review.kanza}  {review.mean} {review.sound}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CongratulationModal;
