export const API = {
    // A股指数接口 基础信息: https://www.lixinger.com/open/api/doc?api-key=cn/index
    CN_INDEX_BASE: 'https://open.lixinger.com/api/cn/index',
    // 港股指数基础信息接口 https://www.lixinger.com/open/api/doc?api-key=hk/index
    HK_INDEX_BASE: 'https://open.lixinger.com/api/hk/index',
    // 美股指数基础信息接口 https://www.lixinger.com/open/api/doc?api-key=us/index
    US_INDEX_BASE: 'https://open.lixinger.com/api/us/index',
    // A股指数接口 基本面数据: https://www.lixinger.com/open/api/doc?api-key=cn/index/fundamental
    CN_INDEX_FUNDAMENTAL: 'https://open.lixinger.com/api/cn/index/fundamental',
    // 港股指数 基本面数据：https://www.lixinger.com/open/api/doc?api-key=hk/index/fundamental
    HK_INDEX_FUNDAMENTAL: 'https://open.lixinger.com/api/hk/index/fundamental',
    // 美股指数 基本面数据：https://www.lixinger.com/open/api/doc?api-key=us/index/fundamental
    US_INDEX_FUNDAMENTAL: 'https://open.lixinger.com/api/us/index/fundamental'
}

export const MARKET: Record<string, string> = {
    'A股': 'cn',
    '港股': 'hk',
    '美股': 'us'
}

export const BASE_MARKET_API = {
    [MARKET['A股']]: API.CN_INDEX_BASE,
    [MARKET['港股']]: API.HK_INDEX_BASE,
    [MARKET['美股']]: API.US_INDEX_BASE,
};
export const FUNDAMENTAL_MARKET_API: Record<string, string> = {
    [MARKET['A股']]: API.CN_INDEX_FUNDAMENTAL,
    [MARKET['港股']]: API.HK_INDEX_FUNDAMENTAL,
    [MARKET['美股']]: API.US_INDEX_FUNDAMENTAL
}
