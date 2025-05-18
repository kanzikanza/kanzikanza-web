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
            <AuthGate>
                <Suspense>
                    <TestResultPage
                        isAnswered={null}
                        setIsAnswered={null}
                        />
                </Suspense>
        </AuthGate>
        </>
    )
}