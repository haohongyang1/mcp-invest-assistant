export interface ETFInfomation {
    stockCodes: string[]
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


export interface FundamentalRequestBody {
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


