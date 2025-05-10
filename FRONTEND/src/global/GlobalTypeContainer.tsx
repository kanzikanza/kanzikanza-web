export type TestProblems = {
    length: number,
    testLevel: number,
    days: number,
    problems : [string, Problem][]
}
type ProblemWrapper = {

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
    wrongNumbers: number[]
}
