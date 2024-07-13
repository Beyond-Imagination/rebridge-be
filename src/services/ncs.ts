import { NCS_API_KEY, NCS_API_URL } from '@config'
import { INCSAPIResponse, INCSDetailResponse } from '@/types/ncs'

export async function getNCSDetail(target: string): Promise<INCSDetailResponse> {
    const queryKey = {
        pageNo: 1,
        numOfRows: 10,
        LVL: 1,
        SNUM: 1,
        ENUM: 1,
        SWRD: target,
        ServiceKey: NCS_API_KEY,
    }
    const query = Object.keys(queryKey)
        .map(k => encodeURIComponent(k) + '=' + queryKey[k])
        .join('&')
    const res = await fetch(`https://${NCS_API_URL}?${query}`, {
        method: 'GET',
    })
    if (!res.ok) {
        throw new Error('NCS API Error')
    }
    const data = (await res.json()) as INCSAPIResponse
    return data['response']
}
