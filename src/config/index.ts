// 理杏仁指数api
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
    US_INDEX_FUNDAMENTAL: 'https://open.lixinger.com/api/us/index/fundamental',

}

// 理杏仁公司api：这里仅支持A股和港股
export const COMPANY_API = {
    // A股K线数据 ： https://www.lixinger.com/open/api/doc?api-key=cn/company/candlestick
    CN_COMPANY_CANDLESTICK: 'https://open.lixinger.com/api/cn/company/candlestick',
    // 港股K线数据：https://open.lixinger.com/api/hk/company/candlestick
    HK_COMPANY_CANDLESTICK: 'https://open.lixinger.com/api/hk/company/candlestick',

    // A股 基本面数据【注意使用时后面需拼接fsTableType】： https://www.lixinger.com/open/api/doc?api-key=cn/company/fundamental/non_financial
    CN_COMPANY_FUNDAMENTAL: 'https://open.lixinger.com/api/cn/company/fundamental',
    // 港股 基本面数据【注意使用时后面需拼接fsTableType】： https://www.lixinger.com/open/api/doc?api-key=hk/company/fundamental/reit
    HK_COMPANY_FUNDAMENTAL: 'https://open.lixinger.com/api/hk/company/fundamental',
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


export const COMPANY_MARKET_API: Record<string, string> = {
    [MARKET['A股']]: COMPANY_API.CN_COMPANY_CANDLESTICK,
    [MARKET['港股']]: COMPANY_API.HK_COMPANY_CANDLESTICK,
}

export const COMPANY_FUNDAMENTAL_MARKET_API: Record<string, string> = {
    [MARKET['A股']]: COMPANY_API.CN_COMPANY_FUNDAMENTAL,
    [MARKET['港股']]: COMPANY_API.HK_COMPANY_FUNDAMENTAL,
}

// fsTableType 公司类型 
export const FS_TABLE_TYPE: Record<string, string> = {
    'non_financial': '非金融',
    'bank': '银行',
    'security': '证券',
    'insurance': '保险',
    'reit': '房地产投资信托',
    'other_financial': '其他金融',
}

export const FUNDAMENTAL_VALUATION_INDICATORS: Record<string, string> = {
    'pe_ttm': 'PE-TTM',
    'd_pe_ttm': 'PE-TTM(扣非)',
    'pb': 'PB',
    'pb_wo_gw': 'PB(不含商誉)',
    'ps_ttm': 'PS-TTM',
    'pcf_ttm': 'PCF-TTM',
    'ev_ebit_r': 'EV/EBIT',
    'ev_ebitda_r': 'EV/EBITDA',
    'ey': '公司收益率',
    'dyr': '股息率',
    'sp': '股价',
    'spc': '涨跌幅',
    'spa': '股价振幅',
    'tv': '成交量',
    'ta': '成交金额',
    'to_r': '换手率',
    'shn': '总股东人数',
    'mc': '市值',
    'mc_om': 'A股市值',
    'cmc': '流通市值',
    'ecmc': '自由流通市值',
    'ecmc_psh': '人均自由流通市值',
    'fpa': '融资买入金额',
    'fra': '融资偿还金额',
    'fb': '融资余额',
    'ssa': '融券卖出金额',
    'sra': '融券偿还金额',
    'sb': '融券余额',
    'ha_sh': '陆股通持仓股数',
    'ha_shm': '陆股通持仓金额',
    'mm_nba': '陆股通净买入金额',
};

export const METRICS_NAME_CONFIG = {
    'pe_ttm': 'PE-TTM',
    'd_pe_ttm': 'PE-TTM(扣非)',
    'pb': 'PB',
    'pb_wo_gw': 'PB(不含商誉)',
    'ps_ttm': 'PS-TTM',
};

export const GRANULARITY_CONFIG = {
    'fs': '上市以来',
    'y20': '20年',
    'y10': '10年',
    'y5': '5年',
    'y3': '3年',
};

export const STATISTICS_DATA_TYPE_CONFIG = {
    'cvpos': '分位点%',
    'q2v': '20%分位点值',
    'q5v': '50%分位点值',
    'q8v': '80%分位点值',
    'minv': '最小值',
    'maxv': '最大值',
    'maxpv': '最大正值',
    'avgv': '平均值',
};

