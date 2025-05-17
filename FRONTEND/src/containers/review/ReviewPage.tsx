'use client'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ReviewPage() {
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    const limitPerPage = 20
    const router = useRouter()
    const [cards, setCards] = useState([])
    const [current, setCurrent] = useState(0)
    const [isLeaving, setIsLeaving] = useState(false)
    const [isComing, setIsComing] = useState(false)
    const [direction, setDirection] = useState<null | "next" | "prev">(null)
    const [showPrevCard, setShowPrevCard] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    
    useEffect(() => { 
        axios.get(
            NEXT_PUBLIC_SERVER_IP + `/kanzi/getReviewProblems?limit=${limitPerPage}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, }
            }
        )
            .then(
                (result) => { 
                    // 데이터 파싱
                    const arr = result.data[1].map((item: any) => {
                        const kanza = item[1].kanzaIndex[1]
                        return {
                            letter: kanza.kanzaLetter,
                            sound: kanza.kanzaSound,
                            mean: kanza.kanzaMean,
                        }
                    })
                    setCards(arr)
                }
            )
            .catch()
    }, [])

    // 다음 카드
    const goNext = () => {
        if (current < cards.length - 1 && !isLeaving && !direction) {
            setDirection("next")
            setIsLeaving(true)
        }
    }
    // 이전 카드
    const goPrev = () => {
        if (current > 0 && !isLeaving && !direction) {
            setDirection("prev")
            setShowPrevCard(true)
            setIsComing(true)
            // setTimeout(() => setIsLeaving(true), 10) // 약간의 딜레이로 enter 애니메이션 적용
        }
    }

    // 애니메이션 끝나면 current 변경
    const handleAnimationEnd = () => {
        if (direction === "next") {
            setCurrent((prev) => prev + 1)
            setIsLeaving(false)
            setDirection(null)
        } else if (direction === "prev") {
            setCurrent((prev) => prev - 1)
            setIsLeaving(false)
            setIsComing(false)
            setDirection(null)
            setShowPrevCard(false)
        }
    }

    // 카드 클릭 핸들러 (카드가 이동 중이 아닐 때만 뒤집기)
    const handleCardClick = () => {
        if (!isLeaving && !isComing && !direction) {
            setIsFlipped((prev) => !prev);
        }
    };

    // 카드 이동 시에는 항상 앞면으로 초기화
    useEffect(() => {
        setIsFlipped(false);
    }, [current]);

    // 카드 스타일
    const getCardStyle = (idx: number) => {
        const offset = idx - current
        if (offset < 0) return { display: "none" }
        if (offset > 2) return { display: "none" }
        return {
            position: "absolute" as const,
            left: "50%",
            top: "50%",
            width: "520px",
            height: "380px",
            background: "#F7E9DD",
            borderRadius: 40,
            boxShadow: "0 8px 32px #e0cfc0",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            transform: `
                translate(-50%, -50%)
                scale(${1 - offset * 0.07})
                translateY(${offset * 30}px)
            `,
            zIndex: 10 - offset,
            opacity: offset === 0 ? 1 : 0.7 - offset * 0.1,
            transition: isLeaving ? "transform 0.3s, opacity 0.3s" : "none",
        }
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#fff",
        }}>
            {/* 안내 메시지: 가장 많이 틀린 문제들 위주로 복습합니다 */}
            <div style={{
                marginBottom: 30,
                padding: "18px 48px",
                // background: "#fbeee6",
                borderRadius: 18,
                fontSize: 32,
                color: "#7a6f5c",
                fontWeight: 700,
                boxShadow: "0 2px 8px #e0cfc0",
                textAlign: "center"
            }}>
                가장 많이 틀린 문제들 위주로 복습합니다
            </div>
            {/* 틀린 문제가 없을 때 안내 메시지 */}
            {cards.length === 0 ? (
                <div style={{
                    marginTop: 100,
                    padding: "40px 60px",
                    background: "#fbeee6",
                    borderRadius: 24,
                    fontSize: 36,
                    color: "#7a6f5c",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px #e0cfc0",
                    textAlign: "center"
                }}>
                    틀린 문제가 없습니다!
                </div>
            ) : (
                <>
                    <div style={{
                        position: "relative",
                        width: 600,
                        height: 450,
                        marginBottom: 20,
                        overflow: "visible"
                    }}>
                        {/* 이전 카드가 내려오는 애니메이션 */}
                        {showPrevCard && direction === "prev" && current > 0 && (
                            <div
                                className="card enter-down"
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: "520px",
                                    height: "380px",
                                    background: "#F7E9DD",
                                    borderRadius: 40,
                                    boxShadow: "0 8px 32px #e0cfc0",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: "translate(-50%, -80%) scale(1.18)",
                                    zIndex:  isComing? 4 : 3 ,
                                }}
                                onAnimationEnd={handleAnimationEnd}
                            >
                                <div style={{  fontSize: 120, color: "#333", fontWeight: 700  }}>{cards[current - 1].letter}</div>
                                {/* <div style={{ fontSize: 36, marginBottom: 16 }}>{cards[current - 1].sound}</div> */}
                                {/* <div style={{ fontSize: 28, color: "#7a6f5c" }}>{cards[current - 1].mean}</div> */}
                            </div>
                        )}
                        {/* 현재 카드 - flip 애니메이션 적용 */}
                        {cards.length > 0 && (
                            <div
                                className={
                                    (direction === "next" && isLeaving)
                                        ? "card leave-up"
                                        : (direction === "prev" && isComing)
                                        ? "card get-cloud"
                                        : "card"
                                }
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: "520px",
                                    height: "380px",
                                    background: "none",
                                    borderRadius: 40,
                                    boxShadow: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: "translate(-50%, -50%) scale(1)",
                                    zIndex: isComing ? 3 : 4,
                                    perspective: 1200,
                                    cursor: (!isLeaving && !isComing && !direction) ? "pointer" : "default"
                                }}
                                onClick={handleCardClick}
                                onAnimationEnd={direction === "next" || direction !== "prev" ? handleAnimationEnd : undefined}
                            >
                                <div className={`flip-card-inner${direction === null && isFlipped ? " flipped" : ""}`} style={{ width: "100%", height: "100%", borderRadius: 40 }}>
                                    {/* 앞면: 한자만 */}
                                    <div className="flip-card-front" style={{
                                        width: "100%", height: "100%", background: "#F7E9DD", borderRadius: 40, boxShadow: "0 8px 32px #e0cfc0",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <span style={{ fontSize: 120, color: "#333", fontWeight: 700 }}>{cards[current].letter}</span>
                                    </div>
                                    {/* 뒷면: 음, 뜻 */}
                                    <div className="flip-card-back" style={{
                                        width: "100%", height: "100%", background: "#F7E9DD", borderRadius: 40, boxShadow: "0 8px 32px #e0cfc0",
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <div style={{ fontSize: 48, marginBottom: 24, color: "#333", fontWeight: 700 }}>{cards[current].mean}</div>
                                        <div style={{ fontSize: 36, color: "#7a6f5c", textAlign: "center" }}>{cards[current].sound}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* 좌우 이동 버튼: 더 크게 */}
                    <div style={{ display: "flex", gap: 30, marginTop: 30, marginLeft: 60, marginRight: 60 }}>
                        <button onClick={goPrev} disabled={current === 0 || isLeaving || !!direction} style={{ background: "#F7E9DD", border: "none", borderRadius: 24, padding: "3px 30px", fontSize: 60, cursor: "pointer", boxShadow: "0 2px 8px #e0cfc0", fontWeight: 700 }}>←</button>
                        <button onClick={goNext} disabled={current === cards.length - 1 || isLeaving || !!direction} style={{ background: "#F7E9DD", border: "none", borderRadius: 24, padding: "30px 30px", fontSize: 60, cursor: "pointer", boxShadow: "0 2px 8px #e0cfc0", fontWeight: 700 }}>→</button>
                    </div>
                </>
            )}
            <style jsx>{`
                .card {
                    animation: none;
                }
                .get-cloud {
                    animation: gettingFaded 0.2s forwards;
                }
                .leave-up {
                    animation: floatFadeUp 0.2s forwards;
                }
                .enter-down {
                    animation: floatEnterDown 0.2s forwards;
                }
                /* flip 카드 애니메이션 */
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.5s cubic-bezier(0.4,0.2,0.2,1);
                    transform-style: preserve-3d;
                }
                .flip-card-inner.flipped {
                    transform: rotateY(180deg);
                }
                .flip-card-front, .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 40px;
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                }
                @keyframes gettingFaded {
                    0% {
                        opacity: 0.5;
                        transform: translate(-50%, -80%) scale(0.7);
                        filter: blur(4px);
                    }
                    80% {
                        opacity: 0.5;
                        transform: translate(-50%, -60%) scale(0.5);
                        filter: blur(1.5px);
                    }
                    100% {
                        opacity: 0.1;
                        transform: translate(-50%, -50%) scale(0.3);
                        filter: blur(0px);
                    }
                }

                @keyframes floatFadeUp {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                        filter: blur(0px);
                    }
                    80% {
                        opacity: 0.2;
                        transform: translate(-50%, -70%) scale(1.15);
                        filter: blur(2px);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -80%) scale(1.18);
                        filter: blur(4px);
                    }
                }
                @keyframes floatEnterDown {
                    0% {
                        opacity: 0.7;
                        transform: translate(-50%, -80%) scale(1.18);
                        filter: blur(4px);
                    }
                    30% {
                        opacity: 1;
                        transform: translate(-50%, -60%) scale(1.04);
                        filter: blur(1.5px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                        filter: blur(0px);
                    }
                }
            `}</style>
        </div>
    )
}