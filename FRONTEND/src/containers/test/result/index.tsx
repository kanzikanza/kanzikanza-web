'use client'
import { AuthGate } from "@/global/GlobalAuthGate";
import TestResultPage from "./TestResultPage";
import TestResultModalPage from "./TestResultModalPage";

export default function TestResult() {
    return (
        <>
        <TestResultModalPage>
        </TestResultModalPage>
        <AuthGate>
            <TestResultPage
                isAnswered={null}
                setIsAnswered={null}
            />
        </AuthGate>
        </>
    )
}