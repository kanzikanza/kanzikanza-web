import { TestProblems, Problem, TestMetadata } from "./GlobalTypeContainer";

export class apiDecoder {
    
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