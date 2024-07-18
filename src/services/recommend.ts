import { HfInference } from '@huggingface/inference'

import { HUGGING_FACE_API_KEY } from '@config'
import { ISimpleUserInfo } from '@/types/user'
import { TrainCourse } from '@/models'

export async function getRecommendList(userInfo: ISimpleUserInfo, trainCourseInfo: TrainCourse[]): Promise<TrainCourse[]> {
    const extractFields = <T>(domain: TrainCourse[], target: keyof TrainCourse): T[] => {
        return domain.map(d => (d[target] ? (d[target] as T) : ('' as T)))
    }

    const ncsCd = extractFields<string>(trainCourseInfo, 'ncsCd')
    const title = extractFields<string>(trainCourseInfo, 'title')
    const elEmpRate = extractFields<number>(trainCourseInfo, 'elEmplRate')
    const trainGoal = extractFields<string>(trainCourseInfo, 'trainGoal')
    const trainPreCourse = extractFields<string>(trainCourseInfo, 'trainPreCourse')
    const trainPreQual = extractFields<string>(trainCourseInfo, 'trainPreQual')
    const trainAvgAge = extractFields<number>(trainCourseInfo, 'trainAvgAge')

    const similarity = await Promise.all([
        getSimilarity(userInfo.major, ncsCd),
        getSimilarity(userInfo.major, title),
        getSimilarity(userInfo.major, trainGoal),
        getSimilarity(userInfo.major, trainPreCourse),
        getSimilarity(userInfo.prevJob, trainPreCourse),
        getSimilarity(userInfo.prevJob, trainPreQual),
        getSimilarity(userInfo.jobObjectives, ncsCd),
        getSimilarity(userInfo.jobObjectives, title),
    ])

    const result = trainCourseInfo.map((t, i) => ({
        ...t,
        recommendScore:
            2 * (similarity[0][i] + similarity[1][i] + similarity[2][i] + similarity[3][i] + similarity[4][i] + similarity[5][i]) +
            4 * (similarity[6][i] + similarity[7][i]) +
            (trainAvgAge[i] !== -1 ? 1 - Math.abs(userInfo.age - trainAvgAge[i]) / 100 : 0) +
            (elEmpRate[i] !== -1 ? elEmpRate[i] / 100 : 0),
    }))
    result.sort((a, b) => b.recommendScore - a.recommendScore)
    return result
}

export async function getSimilarity(source: string, sentences: string[]) {
    const inference = new HfInference(HUGGING_FACE_API_KEY)
    return await inference.sentenceSimilarity({
        model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        inputs: {
            source_sentence: source,
            sentences: sentences,
        },
    })
}
