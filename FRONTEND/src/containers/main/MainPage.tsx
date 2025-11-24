'use client'
import withInitialization from "@/global/globalComponent";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
// MUI removed
import { apiDecoder } from "@/global/GlobalApiDecoder";
import { TestConfigDto } from "@/global/GlobalTypeContainer";
// import { useRouter } from 'next/navigation';

import Link from "next/link";
import api from "@/lib/api";

// Styled components removed - using Tailwind classes

function UniqueName({isAnswered, setIsAnswered}) {
    const [userStreakDays, setUserStreakDays] = useState<Number>(0)
    const levels = [8, 7, 6, 5, 4, 3, 2, 1, 0]

    const MaxDays = 5
    const totalLevels = 9
    const stateArrays = [0,]
    const progressArrays = [0,]
    stateArrays.length = MaxDays * totalLevels
    progressArrays.length = MaxDays * totalLevels
    stateArrays.fill(0)
    progressArrays.fill(0)

    
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    const decoder = new apiDecoder()
    const [useStateArrays, setUseStateArrays] = useState<any>(new Array(MaxDays * totalLevels).fill(0))
    const [useProgressArrays, setUseProgressArrays] = useState<any>(new Array(MaxDays * totalLevels).fill(0))
    const [unlockList, setUnlockList] = useState<[string, TestConfigDto][] | null>(null);
  // console.log(NEXT_PUBLIC_SERVER_IP, process, process.env)

  // setIsAnswered(true)
  useEffect(() => {
    setIsAnswered(true);  // 렌더링 끝난 후에 호출됨 → 안전!
  }, []);
  useEffect(() => {
    const fetchData = async (url: string, isToken: boolean) => {
            try {
                await api.get(url,
                // {
                //   headers : {Authorization : `Bearer ${localStorage.getItem('accessToken')}`,}
                // }
                ).then((answer) => {
                    console.log(`Get Success : ${url}`, answer)
                    const [defaultProfile, testConfig] = decoder.decodeMainPageResponse(answer.data)
                    console.log(testConfig)

                    const useStateArrays_copy = [...useStateArrays]
                    const useProgressArrays_copy = [...useProgressArrays]
                    testConfig.forEach((x) => {
                        x[1].testLevel
                        x[1].usetTestDays
                        x[1].userTestProgress
                        useStateArrays_copy[(x[1].testLevel - 1) * MaxDays + x[1].usetTestDays - 1] = 1
                        useProgressArrays_copy[(x[1].testLevel - 1) * MaxDays + x[1].usetTestDays - 1] = x[1].userTestProgress
                    })
                    console.log(stateArrays)
                    console.log(progressArrays)
                    setUseStateArrays(useStateArrays_copy)
                    setUseProgressArrays(useProgressArrays_copy)
                    setUserStreakDays(defaultProfile.userStreakDays)
                    
                })
                .catch((error) => {
                    console.log(error)
                    
                });
                // let response: any[] = []
                // if (!response ) {
                //     throw "response doesn't have val"
                // }
                // console.log(response);
                // response = response.map((x) => x[1])
                // setKanzas(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(NEXT_PUBLIC_SERVER_IP + '/auth/getStreakDay', false);

  }, [])

  const isLocked = (level: number, index: number) => {
      // 임시 로직 - 나중에 API로 대체
    return useStateArrays[level * MaxDays + index] === 0
  };

  return (
    <div className="flex p-4">
      {/* 상단 상태 표시 */}
      <div className="flex-grow">
        <div className="flex items-center justify-center h-12 mb-2 p-4 border border-black rounded-lg bg-[#ffe]">
          <h6 className="text-xl font-medium">
            🔥 {String(userStreakDays)} 일 째 도전 중!
          </h6>
        </div>

        {/* 스크롤 가능한 리스트 */}
        <div className="h-[85vh] overflow-y-auto pr-2 pl-2">
          {levels.map((level) => (
            <div key={level} className="mb-2 min-w-[60rem] max-w-full max-h-[27rem] overflow-x-hidden">
              {/* 급수 제목 */}
              <h4 className="text-3xl font-bold mb-4">
                {level + 1}급
              </h4>
              <hr className="border-t border-gray-300 mx-4 mb-5" />
            
              {/* 버튼 그리드 */}
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => {
                  const locked = isLocked(level, index);
                  const progress = useProgressArrays[level* MaxDays + index] || 0;
                  
                  return (
                    <div key={index}>
                      <Link href={locked ? '#' : `/test?levels=${level}&days=${index}`}>
                        <button 
                          className={`rounded-full h-40 min-w-[10rem] m-0.5 normal-case relative overflow-hidden transition-colors ${
                            locked 
                              ? 'bg-[#E0E0E0] cursor-not-allowed' 
                              : 'bg-[#F9DCDC] hover:bg-[#ffccbc]'
                          }`}
                          disabled={locked}
                        >
                          <span className="text-2xl font-bold text-[#666666] relative z-[2]">
                            第 {index + 1}章
                          </span>
                          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[1]">
                            <svg className="absolute w-40 h-40 -rotate-90">
                              <circle
                                cx="80"
                                cy="80"
                                r="72"
                                fill="none"
                                stroke="#FF8C69"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 72}`}
                                strokeDashoffset={`${2 * Math.PI * 72 * (1 - progress / 10)}`}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                              />
                            </svg>
                          </div>
                          {locked && (
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 rounded-full z-[2]">
                              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default UniqueName