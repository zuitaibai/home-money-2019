export const nameMap = {
    _listPay: {
        rd: 'listPay',
        cn: '支出'
    },
    _listCome: {
        rd: 'listCome',
        cn: '收入'
    },
    _listAccount: {
        rd: 'listAccounts',
        cn: '帐目'
    },
    _statistics: {
        rd: 'listStatistics',
        cn: '统计'
    }
};

export const map2Cn = (rd: string) => {
    const arr = Object.values(nameMap).filter(v => v.rd === rd);
    return arr.length >= 1 ? arr[0].cn : '';
};
export const map2Rd = (cn: string) => {
    const arr = Object.values(nameMap).filter(v => v.cn === cn);
    return arr.length >= 1 ? arr[0].rd : '';
};
export const map2Key = (str: string, strType: string = 'rd') => {
    for (const key in nameMap) {
        if (nameMap[key][strType] === str) {
            return key;
        }
    }
};

export const defPageSize = 20;
