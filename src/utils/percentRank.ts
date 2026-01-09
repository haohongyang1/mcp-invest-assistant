function percentRank(arr: number[], val: number): number {
    // 转换为数字并过滤有效值
    const numArr = arr.map(v => Number(v)).filter(v => !isNaN(v));
    
    // 如果数组为空，返回0
    if (numArr.length === 0) return 0;

    // 对数组进行升序排序
    numArr.sort((a, b) => a - b);

    const numVal = Number(val);
    
    // 计算有多少个值小于等于当前值
    let count = 0;
    for (let i = 0; i < numArr.length; i++) {
        if (numArr[i] <= numVal) {
            count++;
        }
    }
    
    // 百分排名公式：(排名 - 1) / (总数 - 1) * 100%
    // 排名 = 小于等于该值的数量
    const percentile = ((count - 1) / (numArr.length - 1)) * 100;
    
    // 确保返回值在 0-100 之间
    return Math.max(0, Math.min(100, percentile));
}
export default percentRank;