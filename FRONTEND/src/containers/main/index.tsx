'use client'
import { AuthGate } from "@/global/GlobalAuthGate"
import UniqueName from "./MainPage"
import { useState } from "react"
// export default function Main() {
//   return (
//     withInitialization(UniqueName)
//   )
// };
export default function MainPageIndex() {
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  return (
    <AuthGate>
      <UniqueName
        isAnswered={isAnswered}
        setIsAnswered={setIsAnswered}
      >

      </UniqueName>
    </AuthGate>
  )
}


