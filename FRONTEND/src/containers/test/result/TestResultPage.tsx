'use client'
// MUI removed
import { useRouter, useSearchParams } from "next/navigation";
import { apiDecoder } from "@/global/GlobalApiDecoder";
import { useEffect, useState } from "react";
import axios from "axios";
import ComingSoon from "@/component/ComingSoon";
import { TestResultData, Problem } from "@/global/GlobalTypeContainer";
import KanzaWrongCardSlider from "@/component/KanzaWrongCardSlider";
import api from "@/lib/api";

export default function TestResultPage({isAnswered, setIsAnswered} : {isAnswered : null | boolean, setIsAnswered : null | any}) {
    // 예시 데이터 (실제 데이터로 교체 필요)
    const [score, setScore] = useState<number>(0);
    const [wrongProblems, setWrongProblems] = useState<Problem[]>([]);
    // const wrongProblems = ["문제 2", "문제 5", "문제 8"];
    const statMsg = "최근 며칠보다 5점 올랐어요~ 등등";
    const router = useRouter()
    const searchParams = useSearchParams()
    const decoder = new apiDecoder()
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP

    const levels : number = Number(searchParams.get('levels'))
    const days: number = Number(searchParams.get('days'))
    
    useEffect(() => { 
        api.get(NEXT_PUBLIC_SERVER_IP + `/kanzi/getFinalResults?levels=${levels}&days=${days}`
            ,
        ).then((response) => {
            console.log(response)
            let data: TestResultData = decoder.decodeGetFinalResults(response['data'][1])
            setWrongProblems(data.wrongProblemDetail)
            setScore((20 - data.testMetaData.wrongNumbers[1].length) * 5)
         })
        
    }, [])
    setIsAnswered(true)
    
    // wrongProblems 데이터 변환 (API 예시 구조 대응)
    const wrongKanzaData = wrongProblems.map((problem: any) => {
        // API 구조에 따라 분기 처리
        if (problem.kanzaLetter && problem.kanzaMean && problem.kanzaSound) {
            // 기존 구조
            return {
                kanzaLetter: problem.kanzaLetter,
                kanzaSound: problem.kanzaSound,
                kanzaMean: problem.kanzaMean,
            }
        } else if (problem.kanzaIndex && problem.kanzaIndex[1]) {
            // API 예시 구조
            return {
                kanzaLetter: problem.kanzaIndex[1].kanzaLetter,
                kanzaSound: problem.kanzaIndex[1].kanzaSound,
                kanzaMean: problem.kanzaIndex[1].kanzaMean,
            }
        }
        return { kanzaLetter: '', kanzaSound: '', kanzaMean: '' }
    })

    return (
        <div>
            <div className="topContainter w-[60rem] min-h-[40rem] border-[3px] border-[#DDA15E] rounded-[2rem] my-8 mx-auto p-10 flex flex-col justify-between shadow-lg bg-white">
                <div className="flex flex-1 gap-8">
                    {/* 틀린 문제 리스트 */}
                    <div className="flex-1 min-h-[24rem] m-4 border-[2.5px] border-[#DDA15E] rounded-[1.5rem] flex flex-col shadow-md bg-white overflow-hidden">
                        <h4 className="text-center text-[#BC6C25] font-bold text-3xl p-4 mb-2">
                            틀린 문제 리스트
                        </h4>
                        <div className="overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-[#DDA15E] scrollbar-track-gray-100 scrollbar-thumb-rounded">
                            <ul className="list-none p-0">
                                {wrongProblems.map((problem, idx) => (
                                    <li 
                                        key={idx}
                                        className="bg-[#FFF8F0] rounded-2xl mb-2 border border-[#DDA15E] p-4"
                                    >
                                        <div className="w-full flex justify-between">
                                            <span className="font-bold text-xl">
                                                {problem.kanzaLetter}
                                            </span>
                                            <span className="text-[#666]">
                                                {problem.kanzaMean}
                                            </span>
                                            <span className="text-[#BC6C25]">
                                                {problem.kanzaSound}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 점수 및 통계 */}
                    <div className="flex-1 min-h-[24rem] flex flex-col gap-8">
                        {/* 점수 컴포넌트 */}
                        <div className="flex-1 m-4 border-[2.5px] border-[#DDA15E] rounded-[1.5rem] flex flex-col items-center justify-center shadow-md bg-white min-h-[11rem]">
                            <h4 className="text-center mb-2 text-[#BC6C25] font-bold text-3xl">
                                점수
                            </h4>
                            <h6 className="text-center text-xl">
                                당신은 {score}점입니다
                            </h6>
                        </div>
                        {/* 최근 점수 컴포넌트 (비활성화, 추후 공개) */}
                        <div className="flex-1 m-4 border-[2.5px] border-dashed border-[#DDA15E] rounded-[1.5rem] flex flex-col items-center justify-center shadow-none bg-[#F5F5F5] opacity-60 min-h-[11rem]">
                            <h4 className="text-center mb-2 text-[#BC6C25] font-bold text-3xl">
                                최근 점수 비교
                            </h4>
                            <ComingSoon />
                        </div>
                    </div>
                </div>

                {/* 돌아가기 버튼 */}
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-[#FFCC99] text-[#333] font-bold border-2 border-[#DDA15E] rounded-2xl hover:bg-[#FFB366] min-w-[12rem] text-xl px-6 py-3 transition-colors"
                        onClick={() => { router.push('/')}}
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        </div>
    )
}