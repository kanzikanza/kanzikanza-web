import {
    TestProblems,
    Problem,
    TestMetadata,
    Token,
    DefaultProfile,
    TestConfigDto,
    TestResultData
 } from "./GlobalTypeContainer";

export class apiDecoder {
    public decodeMainPageResponse(object: Object): null | [DefaultProfile, [string, TestConfigDto][]] {
        if (object['first'][0] !== "com.example.restservice.dtos.UserUniteDtos$DefaultProfile")
            return null 
        if (object['second'][0] !== "java.util.ArrayList")
            return null
        const defaultProfile: DefaultProfile = object['first'][1]
        const testConfig: [string, TestConfigDto][] = object['second'][1]
        return [defaultProfile, testConfig]
    }

    public decodeTestMetaData(object: Object): TestMetadata | null {
        let metaData: TestMetadata
        if (object[0] !== "com.example.restservice.dtos.KanzaUniteDtos$TestMetaData")
        {
            return null
        }
        metaData = object[1]
        console.log("1" , metaData)
        return metaData
    } 

    public decodeLoginReponse(object: Object) : null | [Token, DefaultProfile]{
        if (object['first'][0] !== "com.example.restservice.dtos.UserUniteDtos$LoginResponse")
            return null
        if (object['second'][0] !== "com.example.restservice.dtos.UserUniteDtos$DefaultProfile")
            return null

        const token: Token = object['first'][1]
        const defaultProfile: DefaultProfile = object['second'][1]
        return [token, defaultProfile]
    }

    public decodeGetFinalResults(object: object) : TestResultData  {
        let testResultData: TestResultData = {
            userStreak: 0,
            testMetaData: {
                progress: 0,
                totalProblem: 0,
                wrongNumbers: [0]
            },
            isFirstTestToday : false,
            wrongProblemDetail : []
        }
        console.log(object)
        let arg1: TestMetadata = this.decodeTestMetaData(object['testMetaData'])
        console.log(arg1)
        if (arg1 !== null)
            testResultData.testMetaData = arg1
        console.log("2")
        testResultData.isFirstTestToday = object['isFirstTestToday']
        console.log("3")
        testResultData.userStreak = object['userStreak']
        console.log("4")
        testResultData.wrongProblemDetail = this.decodeProblemList(object['wrongProblemDetail'])
        console.log("6")
        return testResultData
    }
    public decodeProblemList(object: any[]): Problem[] {
        const problemList: Problem[] = []
        console.log(object)
        console.log("5")

        if (object.length === 0 || object[0] !== "java.util.ArrayList")
            return problemList;
        object[1].forEach((x) => { 
            if (x[0] !== "com.example.restservice.dtos.KanzaUniteDtos$Problem") return
            let problem: Problem = {
                problemType: 0,
                isFromCache: 0,
                options: [],
                level: 0,
                answer: 0,
                problemIndex: 0,
                kanzaIndex : 0,
                kanzaMean : '',
                kanzaSound : '', 
                kanzaLetter : '',
                problemContent : ''
            };
            problem.problemType = x[1].problemType
            problem.isFromCache = x[1].isFromCache
            problem.options = x[1].options
            //level
            problem.answer = x[1].answer
            problem.problemIndex = x[1].problemIndex
            problem.kanzaIndex = x[1].kanzaIndex
            problem.kanzaMean = x[1].kanzaMean
            problem.kanzaSound = x[1].kanzaSound
            problem.kanzaLetter = x[1].kanzaLetter
            problem.problemContent = x[1].problemContent
            problemList.push(problem)
        })
        return problemList
    }

    public decodeTestProblems(object: Object) : null | [TestProblems, TestMetadata]  {
        let metaData: TestMetadata
        if (object['second'][0] !== "com.example.restservice.dtos.KanzaUniteDtos$TestMetaData")
        {
            return null
        }

        metaData = object['second'][1]

        console.log('metadata', metaData)
        let testData: TestProblems = {
            length: 0,
            testLevel: 0,
            days: 0,
            problems : [['', null]]
        }
        if (object['first'][0] !== "com.example.restservice.dtos.KanzaUniteDtos$TestProblems")
        {
            return null
        }
        console.log('testData ',testData)
        console.log(object['first'][1])
        testData.days = Number(object['first'][1]['days'])
        testData.testLevel = object['first'][1]['testLevel']
        testData.length = object['first'][1]['length']
        testData.days = object['first'][1]['days']
        testData.problems = object['first'][1]['problems']
        return [testData, metaData]
    }
}