'use client';

import api from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';

const HANJA_KEYS = [
  ['學', '生', '問', '答', '語', '文', '字', '書', '讀', '寫'],
  ['人', '間', '世', '界', '國', '家', '社', '會', '團', '體'],
  ['山', '水', '木', '火', '土', '金', '銀', '銅', '鐵', '石'],
];

// 한자 정보 (뜻과 음)
const HANJA_INFO: Record<string, { meaning: string; sound: string }> = {
  '學': { meaning: '배울', sound: '학' },
  '問': { meaning: '물을', sound: '문' },
  '國': { meaning: '나라', sound: '국' },
  '火': { meaning: '불', sound: '화' },
  '金': { meaning: '쇠/금', sound: '금' },
  '生': { meaning: '날', sound: '생' },
  '答': { meaning: '대답할', sound: '답' },
  '語': { meaning: '말씀', sound: '어' },
  '文': { meaning: '글월', sound: '문' },
  '字': { meaning: '글자', sound: '자' },
  '書': { meaning: '글', sound: '서' },
  '讀': { meaning: '읽을', sound: '독' },
  '寫': { meaning: '베낄', sound: '사' },
  '人': { meaning: '사람', sound: '인' },
  '間': { meaning: '사이', sound: '간' },
  '世': { meaning: '인간', sound: '세' },
  '界': { meaning: '지경', sound: '계' },
  '家': { meaning: '집', sound: '가' },
  '社': { meaning: '모일', sound: '사' },
  '會': { meaning: '모일', sound: '회' },
  '團': { meaning: '둥글', sound: '단' },
  '體': { meaning: '몸', sound: '체' },
  '山': { meaning: '뫼', sound: '산' },
  '水': { meaning: '물', sound: '수' },
  '木': { meaning: '나무', sound: '목' },
  '土': { meaning: '흙', sound: '토' },
  '銀': { meaning: '은', sound: '은' },
  '銅': { meaning: '구리', sound: '동' },
  '鐵': { meaning: '쇠', sound: '철' },
  '石': { meaning: '돌', sound: '석' },
};

// 목업 정답 데이터
const ANSWER = ['學', '問', '國', '火', '金'];

type CellState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

interface KandleKanza {
  kanzaKanza: string;
  kanzaMean: string;
  kanzaSound: string;
}

interface KandleSessionData {
  uniqueId: string;
  answerLength: number;
  responses: unknown[];
  kandleWordKanzas: unknown[];
}

interface KandleKanzaResponse {
  kanza: string;
  state: number; // 0: absent, 1: present, 2: correct
}

interface KandleSubmitResponse {
  kandleKanzaResponses: unknown[];
  position: number;
  answer: string | null;
}

const ROWS = 6;
const DEFAULT_COLS = 5;

export default function Home() {
  const [answerLength, setAnswerLength] = useState(DEFAULT_COLS);
  const [guesses, setGuesses] = useState<string[][]>(
    Array(ROWS).fill(null).map(() => Array(DEFAULT_COLS).fill(''))
  );
  const [cellStates, setCellStates] = useState<CellState[][]>(
    Array(ROWS).fill(null).map(() => Array(DEFAULT_COLS).fill('empty'))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [solvedAttempt, setSolvedAttempt] = useState(0);
  
  // 세션 데이터
  const [sessionId, setSessionId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentKanzas, setCurrentKanzas] = useState<KandleKanza[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string[]>(ANSWER);
  const [currentHanjaInfo, setCurrentHanjaInfo] = useState<Record<string, { meaning: string; sound: string }>>(HANJA_INFO);
  const [currentHanjaKeys, setCurrentHanjaKeys] = useState<string[][]>(HANJA_KEYS);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [hoveredHanja, setHoveredHanja] = useState<string | null>(null);

  // 새로운 칸들 세션 시작
  const initializeKandleSession = async () => {
    setIsLoadingSession(true);
    try {
      const response = await api.get('/kandle/newKandleSession');
      
      const data = response.data;
      console.log('세션 데이터:', data);
      
      // 응답 구조: [타입, { uniqueId, answerLength, responses, kandleWordKanzas }]
      const sessionData = data[1] as KandleSessionData;
      const kanzasArray = (sessionData.kandleWordKanzas as [string, unknown[]])[1];
      const newAnswerLength = sessionData.answerLength;
      
      // 한자 데이터 추출 및 매핑
      const kanzas: KandleKanza[] = (kanzasArray as [string, KandleKanza][]).map((item) => item[1]);
      
      // answerLength 개수만큼 정답으로 설정
      const answer = kanzas.slice(0, newAnswerLength).map(k => k.kanzaKanza);
      
      // 한자 정보 매핑 생성
      const hanjaInfo: Record<string, { meaning: string; sound: string }> = {};
      kanzas.forEach(kanza => {
        hanjaInfo[kanza.kanzaKanza] = {
          meaning: kanza.kanzaSound, // kanzaSound가 뜻
          sound: kanza.kanzaMean,     // kanzaMean이 음
        };
      });
      
      // 한자를 3줄로 나눠서 키보드 생성 (각 줄에 균등하게)
      const hanjaChars = kanzas.map(k => k.kanzaKanza);
      const rowSize = Math.ceil(hanjaChars.length / 3);
      const hanjaKeys = [
        hanjaChars.slice(0, rowSize),
        hanjaChars.slice(rowSize, rowSize * 2),
        hanjaChars.slice(rowSize * 2),
      ];
      
      // 상태 업데이트
      setSessionId(sessionData.uniqueId);
      setAnswerLength(newAnswerLength);
      setCurrentKanzas(kanzas);
      setCurrentAnswer(answer);
      setCurrentHanjaInfo(hanjaInfo);
      setCurrentHanjaKeys(hanjaKeys);
      
      // 게임 초기화
      const newGuesses = Array(ROWS).fill(null).map(() => Array(newAnswerLength).fill(''));
      const newCellStates = Array(ROWS).fill(null).map(() => Array(newAnswerLength).fill('empty' as CellState));
      let nextRow = 0;
      let nextCol = 0;
      let isGameOver = false;
      let solved = 0;
      
      // responses가 있으면 이전 시도들을 복원
      if (sessionData.responses && Array.isArray(sessionData.responses)) {
        const responsesData = sessionData.responses as [string, unknown[]];
        if (responsesData.length > 1) {
          const attemptsArray = responsesData[1] as [string, unknown[]][];
          
          attemptsArray.forEach((attemptData, attemptIndex) => {
            if (attemptIndex >= ROWS) return; // 최대 6줄까지만
            
            const attemptResponses = attemptData[1] as [string, KandleKanzaResponse][];
            
            attemptResponses.forEach((responseData, kanzaIndex) => {
              if (kanzaIndex >= newAnswerLength) return;
              
              const response = responseData[1];
              newGuesses[attemptIndex][kanzaIndex] = response.kanza;
              
              // state에 따라 cellStates 설정
              if (response.state === 2) {
                newCellStates[attemptIndex][kanzaIndex] = 'correct';
              } else if (response.state === 1) {
                newCellStates[attemptIndex][kanzaIndex] = 'present';
              } else {
                newCellStates[attemptIndex][kanzaIndex] = 'absent';
              }
            });
            
            // 모두 정답이면 게임 종료
            const allCorrect = attemptResponses.every((responseData) => {
              const response = responseData[1];
              return response.state === 2;
            });
            
            if (allCorrect) {
              isGameOver = true;
              solved = attemptIndex + 1;
            } else {
              nextRow = attemptIndex + 1;
              nextCol = 0;
            }
          });
        }
      }
      
      setGuesses(newGuesses);
      setCellStates(newCellStates);
      setCurrentRow(nextRow);
      setCurrentCol(nextCol);
      setGameOver(isGameOver);
      setShowModal(false);
      setSolvedAttempt(solved);
      
    } catch (error) {
      console.error('세션 생성 에러:', error);
      alert('세션 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  // 컴포넌트 마운트 시 세션 자동 생성
  useEffect(() => {
    initializeKandleSession();
  }, []);

  const handleHanjaClick = (hanja: string) => {
    if (gameOver || currentRow >= ROWS) return;
    
    if (currentCol < answerLength) {
      const newGuesses = guesses.map(row => [...row]);
      newGuesses[currentRow][currentCol] = hanja;
      setGuesses(newGuesses);
      
      const newCellStates = cellStates.map(row => [...row]);
      newCellStates[currentRow][currentCol] = 'filled';
      setCellStates(newCellStates);
      
      setCurrentCol(currentCol + 1);
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // 현재 줄이 아니거나 이미 제출된 줄은 클릭 불가
    if (rowIndex !== currentRow || cellStates[rowIndex][colIndex] === 'correct' || 
        cellStates[rowIndex][colIndex] === 'present' || cellStates[rowIndex][colIndex] === 'absent') {
      return;
    }

    if (guesses[rowIndex][colIndex] !== '') {
      const newGuesses = guesses.map(row => [...row]);
      const newCellStates = cellStates.map(row => [...row]);
      
      // 클릭한 칸부터 끝까지 한 칸씩 앞으로 당기기
      for (let i = colIndex; i < answerLength - 1; i++) {
        newGuesses[rowIndex][i] = newGuesses[rowIndex][i + 1];
        newCellStates[rowIndex][i] = newGuesses[rowIndex][i + 1] !== '' ? 'filled' : 'empty';
      }
      newGuesses[rowIndex][answerLength - 1] = '';
      newCellStates[rowIndex][answerLength - 1] = 'empty';
      
      setGuesses(newGuesses);
      setCellStates(newCellStates);
      setCurrentCol(Math.max(0, currentCol - 1));
    }
  };

  const checkGuess = useCallback(async () => {
    if (currentCol !== answerLength) return; // 한 줄이 다 차지 않으면 체크 불가

    const currentGuess = guesses[currentRow];
    const submitText = currentGuess.join('');

    try {
      const response = await api.post('/kandle/submitKandle', {
        type: 'KandleApiRequests',
        submit: submitText,
      });

      const data = response.data;
      console.log('Submit 응답:', data);
      
      // 응답 구조: [타입, { kandleKanzaResponses, position, answer }]
      const submitData = data[1] as KandleSubmitResponse;
      const responsesArray = (submitData.kandleKanzaResponses as [string, unknown[]])[1];
      const kanzaResponses: KandleKanzaResponse[] = (responsesArray as [string, KandleKanzaResponse][]).map((item) => item[1]);
      
      // state에 따라 cellStates 업데이트
      const newCellStates = cellStates.map(row => [...row]);
      kanzaResponses.forEach((response, i) => {
        if (response.state === 2) {
          newCellStates[currentRow][i] = 'correct';
        } else if (response.state === 1) {
          newCellStates[currentRow][i] = 'present';
        } else {
          newCellStates[currentRow][i] = 'absent';
        }
      });
      
      setCellStates(newCellStates);
      
      // 정답 체크 (answer가 있거나 모든 state가 2이면 정답)
      const isCorrect = kanzaResponses.every(r => r.state === 2) || submitData.answer !== null;
      
      if (isCorrect) {
        setGameOver(true);
        setSolvedAttempt(currentRow + 1);
        setTimeout(() => setShowModal(true), 300);
      } else if (currentRow === ROWS - 1) {
        setGameOver(true);
        setTimeout(() => alert(`게임 오버! 정답은 ${submitData.answer || currentAnswer.join('')} 입니다.`), 300);
      } else {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
    } catch (error) {
      console.error('제출 에러:', error);
      alert('제출 중 오류가 발생했습니다.');
    }
  }, [currentCol, currentRow, guesses, cellStates, currentAnswer, answerLength]);

  // 키보드 Enter/Backspace 키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

      // Enter 키 - 정답 체크
      if (event.key === 'Enter' && currentCol === answerLength) {
        checkGuess();
      }
      
      // Backspace 키 - 마지막 문자 제거
      if (event.key === 'Backspace' && currentCol > 0) {
        const newGuesses = guesses.map(row => [...row]);
        const newCellStates = cellStates.map(row => [...row]);
        
        newGuesses[currentRow][currentCol - 1] = '';
        newCellStates[currentRow][currentCol - 1] = 'empty';
        
        setGuesses(newGuesses);
        setCellStates(newCellStates);
        setCurrentCol(currentCol - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCol, currentRow, gameOver, guesses, cellStates, checkGuess, answerLength]);

  const getCellBackgroundColor = (state: CellState) => {
    switch (state) {
      case 'correct':
        return 'bg-green-600';
      case 'present':
        return 'bg-yellow-600';
      case 'absent':
        return 'bg-gray-700';
      case 'filled':
        return 'bg-orange-700';
      default:
        return 'bg-orange-900 bg-opacity-30';
    }
  };

  const isRowComplete = currentCol === answerLength;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans p-4">
      {/* 정답 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-8 max-w-md w-full border-2 border-orange-600 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🎉 정답입니다!
            </h2>
            
            <div className="mb-6 text-center">
              <p className="text-orange-300 text-sm mb-2">시도 횟수</p>
              <p className="text-5xl font-bold text-green-500">{solvedAttempt}/6</p>
            </div>

            <div className="bg-orange-950 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 text-center">한자 풀이</h3>
              <div className="space-y-3">
                {currentAnswer.map((hanja, index) => (
                  <div key={index} className="flex items-center gap-4 bg-orange-800 rounded p-3">
                    <div className="text-4xl font-bold text-white">{hanja}</div>
                    <div className="flex-1">
                      <div className="text-orange-300 font-semibold">
                        {currentHanjaInfo[hanja]?.sound || '?'}
                      </div>
                      <div className="text-orange-100 text-sm">
                        {currentHanjaInfo[hanja]?.meaning || '알 수 없음'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <main className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
        {isLoadingSession ? (
          <div className="text-orange-600 text-2xl font-bold">
            게임 로딩 중...
          </div>
        ) : null}

        {/* 상단 시험 문제 칸 (6줄 x 5칸) */}
        <div className="flex flex-col gap-3">
          {guesses.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3 relative">
              {row.map((cell, colIndex) => {
                const isHovered = cell !== '' && cell === hoveredHanja;
                return (
                  <button
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-20 h-20 rounded-lg
                      flex items-center justify-center text-5xl font-bold
                      transition-all duration-200 ease-in-out
                      ${getCellBackgroundColor(cellStates[rowIndex][colIndex])}
                      ${isHovered 
                        ? 'border-4 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] relative z-10' 
                        : 'border-2'
                      }
                      ${!isHovered && rowIndex === currentRow && cellStates[rowIndex][colIndex] !== 'correct' && 
                        cellStates[rowIndex][colIndex] !== 'present' && 
                        cellStates[rowIndex][colIndex] !== 'absent'
                        ? 'border-orange-500 hover:border-orange-400 cursor-pointer active:scale-95' 
                        : !isHovered ? '' : ''
                      }
                      ${cell !== '' ? 'text-white' : 'text-transparent'}
                    `}
                  >
                    {cell}
                  </button>
                );
              })}
              
              {/* 엔터 버튼 - 현재 줄이 완성되면 표시 */}
              {rowIndex === currentRow && (
                <button
                  onClick={checkGuess}
                  disabled={!isRowComplete}
                  className={`
                    absolute left-[calc(100%+1rem)] px-6 h-20 rounded-lg font-bold text-lg
                    transition-all duration-300 ease-in-out
                    bg-orange-600 hover:bg-orange-500 text-white active:scale-95
                    ${isRowComplete 
                      ? 'opacity-100 cursor-pointer' 
                      : 'opacity-0 pointer-events-none'
                    }
                  `}
                >
                  ENTER
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 하단 한자 키보드 */}
        <div className="flex flex-col gap-3">
          {currentHanjaKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3 justify-center">
              {row.map((hanja, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="relative group">
                  <button
                    onClick={() => handleHanjaClick(hanja)}
                    disabled={gameOver}
                    className={`
                      w-16 h-16 rounded-lg text-3xl font-bold
                      transition-all duration-150 ease-in-out
                      ${gameOver 
                        ? 'bg-orange-950 text-orange-800 cursor-not-allowed' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white cursor-pointer active:scale-95 active:bg-orange-400'
                      }
                    `}
                  >
                    {hanja}
                  </button>
                  
                  {/* 툴팁 */}
                  {!gameOver && currentHanjaInfo[hanja] && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-10">
                      <div className="bg-gradient-to-br from-orange-900 to-orange-800 text-white px-4 py-3 rounded-lg shadow-2xl border-2 border-orange-600 min-w-max">
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-3xl font-bold">{hanja}</div>
                          <div className="h-px w-full bg-orange-600"></div>
                          <div className="text-sm font-semibold text-orange-300">
                            {currentHanjaInfo[hanja]?.sound || '?'}
                          </div>
                          <div className="text-xs text-orange-200">
                            {currentHanjaInfo[hanja]?.meaning || '알 수 없음'}
                          </div>
                        </div>
                        {/* 툴팁 화살표 */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                          <div className="border-8 border-transparent border-t-orange-800"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
