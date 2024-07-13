export interface INCSDetailItem {
    RN: number
    TOT_CNT: number
    NCS_LCLAS_CD: number
    NCS_LCLAS_CDNM: string
    NCS_MCLAS_CD: string
    NCS_MCLAS_CDNM: string
    NCS_SCLAS_CD: string
    NCS_SCLAS_CDNM: string
    NCS_SUBD_CD: string
    NCS_SUBD_CDNM: string
    DUTY_DEF: string
    DUTY_ORD: number
    NCS_DEGR: number
    NCS_COMPE_UNIT_CD: string
    DEVEL_YY: string
    VER_NO: number
    NCS_CL_CD: string
    COMPE_UNIT_NAME: string
    COMPE_UNIT_DEF: string
    COMPE_UNIT_LEVEL: number
    COMPE_UNIT_FACTR_NO_CD: string
    COMPE_UNIT_FACTR_NO: number
    COMPE_UNIT_FACTR_NAME: string
    COMPE_UNIT_FACTR_LEVEL: number
    USG_YN: string
}

export interface INCSDetailResponse {
    header: {
        resultCode: string
        resultMsg: string
    }
    body: {
        items: {
            item: INCSDetailItem[]
        }
    }
}

export interface INCSAPIResponse {
    response: INCSDetailResponse
}
