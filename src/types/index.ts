export interface IndexTemperatureParam {
    marketCn: string;
    stockCodes: string[];
}
export interface CompanyCandlestickParam {
    startDate: string;
    endDate: string;
    marketCn: string;
    // type: string;
    stockCode: string;
}
export interface CompanyFundamentalParam {
    startDate: string;
    endDate: string;
    marketCn: string;
    stockCode: string;
    fsTableType: string;
}

export interface CompanyBaseInfo {
    marketCn: string;
    data: {
        name: string;
        stockCode: string;
        fsTableType: string;
    }[]
}

export type AllCompanyBaseInfo = CompanyBaseInfo[]

export interface ETFInfomation {
    stockCodes: string[],
    market: string,
    token: string
}


export interface BaseRequestBody {
    token: string;
    stockCodes?: string[];
}
export interface BaseResponseData {
    areaCode: string;
    market: string;
    stockCode: string;
    source: string;
    fsTableType: string;
    currency: string;
    name: string;
    launchDate: string;
    rebalancingFrequency: string;
    series: string;
}

export interface BaseResponseBody {
    code: number;
    message: string;
    data: BaseResponseData[];
}


export interface IndexFundamentalRequestBody {
    token: string;
    stockCodes?: string[];
    startDate?: string;
    endDate?: string;
    metricsList?: string[];
}
export interface FundamentalResponseData {
    date: string;
    'pe_ttm.mcw': number;
    'pb.mcw': number;
    stockCode: string;
}

export interface FundamentalResponseBody {
    code: number;
    message: string;
    data: FundamentalResponseData[];
}


export interface CandidateInfomation {
    token: string;
    stockCode: string;
    market: string;
    // type: string;
    startDate: string;
    endDate: string;
}
export interface CandidateRequestBody {
    token: string;
    stockCode: string;
    type: string;
    startDate: string;
    endDate: string;
}

export interface FundamentalInfomation {
    token: string;
    fsTableType: string;
    stockCodes: string[];
    market: string;
    startDate: string;
    endDate: string;
    metricsList?: string[];
}
export interface FundamentalRequestBody {
    token: string;
    stockCodes: string[];
    startDate: string;
    endDate?: string;
    metricsList?: string[];
}

export interface CandidateResponseData {
    date: string;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    amount: number;
    change: number;
    to_r: number;
}
export interface CandidateResponseBody {
    code: number;
    message: string;
    data: CandidateResponseData[];
}
