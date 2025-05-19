import { PreCheckModal } from './TestModalPage'
import TestPage from './TestPage'
import { Suspense } from 'react'
import { AuthGate } from '@/global/GlobalAuthGate'

export default function Test() {
    return (
        <Suspense>
            <AuthGate>
                    <PreCheckModal
                        isAnswered={null}
                        setIsAnswered={null}
                        >
                        <TestPage url={"/kanzi/getTestProblems"} />
                    </PreCheckModal>
            </AuthGate>
        </Suspense>
    )
}