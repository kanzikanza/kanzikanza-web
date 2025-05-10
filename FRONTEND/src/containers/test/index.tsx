import { PreCheckModal } from './TestModalPage'
import TestPage from './TestPage'
import { AuthGate } from '@/global/GlobalAuthGate'

export default function Test() {
    return (
        <AuthGate>
            <PreCheckModal
                isAnswered={null}
                setIsAnswered={null}
            >
                <TestPage url={"/kanzi/getTestProblems"} />
            </PreCheckModal>
        </AuthGate>
    )
}