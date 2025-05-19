'use client'
import { AuthGate } from "@/global/GlobalAuthGate";
import TestResultPage from "./TestResultPage";
import TestResultModalPage from "./TestResultModalPage";
import { Suspense } from 'react'
export default function TestResult() {
    return (
        <>
        <TestResultModalPage>
        </TestResultModalPage>
        <Suspense>
            <AuthGate>
                    <TestResultPage
                        isAnswered={null}
                        setIsAnswered={null}
                        />
            </AuthGate>
        </Suspense>
        </>
    )
}