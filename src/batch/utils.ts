import axios from 'axios'
import axiosRetry from 'axios-retry'

// eslint 관련하여 enum 타입처리 시 에러
// https://github.com/prettier/eslint-plugin-prettier/issues/306
// export enum COMPATIBLE_DATA_TYPES {
//     'CENTER',
//     'COURSE',
// }

export const COMPATIBLE_DATA_TYPES = {
    COURSE: 'COURSE',
    CENTER: 'CENTER',
}

export function extractModelFromJson(jsonString: string, type: string, except: string[]) {
    if (type === COMPATIBLE_DATA_TYPES.COURSE) {
        return JSON.parse(jsonString, (key, value) => {
            if (except.includes(key)) return null
            return value
        })
    } else if (type === COMPATIBLE_DATA_TYPES.CENTER) {
        return JSON.parse(jsonString, (key, value) => {
            if (except.includes(key)) return null
            return value
        })
    } else {
        throw new Error('Unsupported data type')
    }
}

const axiosInstance = axios.create()
axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: retryCount => {
        return retryCount * 1000
    },
    retryCondition: error => {
        return error.response.status === 429
    },
})

interface IKakaoMapResponse {
    documents: {
        x: string
        y: string
    }[]
}

const replaceAddress = (address: string) => {
    const parts: string[] = address.split(' ')
    if (parts.length < 4) {
        throw new Error("failed to replace address, because it doesn't have enough parts")
    }
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`
}

export const getCoordination = async (query: string) => {
    const response = (
        await axiosInstance.get<IKakaoMapResponse>(`${process.env.KAKAO_MAP_URL}?query=${query}`, {
            headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
            },
        })
    ).data.documents[0]

    if (!response) {
        console.error(`No matching address found ==> ${query}`)
        const replacedQuery = replaceAddress(query)
        const retriedResponse = (
            await axiosInstance.get<IKakaoMapResponse>(`${process.env.KAKAO_MAP_URL}?query=${replacedQuery}`, {
                headers: {
                    Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
                },
            })
        ).data.documents[0]
        if (retriedResponse) {
            return { longitude: Number(retriedResponse.x), latitude: Number(retriedResponse.y) }
        }
        return { longitude: -1, latitude: -1 }
    }

    return { longitude: Number(response.x), latitude: Number(response.y) }
}
