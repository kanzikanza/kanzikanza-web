export type TestProblems = {
    length: number,
    testLevel: number,
    days: number,
    problems : [string, Problem][]
}



export type Problem = {
    problemType: number,
    isFromCache: number,
    options: string[],
    level: number | null,
    answer: number,
    problemIndex: number,
    kanzaIndex : number,
    kanzaMean : string
    kanzaSound : string, 
    kanzaLetter : string,
    problemContent : string
}

export type TestMetadata = {
    progress: number,
    totalProblem: number,
    wrongNumbers: [string, number[]]
}

export type Token = {
    refreshToken: string,
    accessToken: string
}

export type DefaultProfile = {
    nickname: string | null,
    profileIndex : number | null,
    userStreakDays : number | null
}

export type TestConfigDto = {
    userTestProgress : number,
    usetTestDays : number,
    testLevel :  number
}

export type TestResultData = {
    userStreak : number,
    testMetaData: TestMetadata,
    isFirstTestToday: boolean,
    wrongProblemDetail : Problem[]
}
