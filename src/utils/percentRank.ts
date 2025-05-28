function percentRank(arr: number[], val: number): number {
    // 对数组进行升序排序
    arr.sort((a, b) => a - b);

    // 找到该值在数组中的位置
    let rank = arr.indexOf(val);

    // 如果找不到该值，则返回 -1
    if (rank === -1) return -1;

    // 计算百分排名
    return (rank / (arr.length - 1));
}
export default percentRank;