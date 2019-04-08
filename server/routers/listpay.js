const Router = require('koa-router');

const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/listPay` });

let storeObj = { //存键值
    outtype1Key: {},
    outtype2Key: {},
    bankTypeKey: {},
    bankKey: {},
    memberKey: {}
};
let storeObj2 = { //存键名
    outtype1Key: null,
    outtype2Key: null,
    bankTypeKey: null,
    bankKey: null,
    memberKey: null
};

async function firstDo(ctx) {
    let getOuttype1 = ctx.db.query('select * from outtype1 where isOpen = 1 order by orderd');
    let getOuttype2 = ctx.db.query('select * from outtype2 order by orderd');
    let getBankType = ctx.db.query('select * from banktype order by orderd');
    let getBank = ctx.db.query('select * from bank order by orderd');
    let member = ctx.db.query('select * from member where ifhome=1 order by orderd');
    let for_from_memberKey = ctx.db.query('select * from member order by orderd');

    let data = await Promise.all([getOuttype1, getBankType, member, getOuttype2, getBank, for_from_memberKey]);
    storeObj2.outtype1Key = data[0];
    storeObj2.outtype2Key = data[3];
    storeObj2.bankTypeKey = data[1];
    storeObj2.bankKey = data[4];
    storeObj2.memberKey = data[5];

    return {
        outtype1Key: data[0],
        bankTypeKey: data[1],
        memberKey: data[2],
        for_from_memberKey: data[5]
    }
}

function build(data, tool) {
    let _data = data ? tool.objDateItemFmt(data, {
        'date_sign': 'yyyy-MM-dd',
        'date_dbCreate': 'yyyy-MM-dd hh:mm:ss'
    }) : [];
    //填充对象：分类、币种、账户的名称
    _data.forEach((v) => {
        let item;
        //outtype1Key
        v.outtype1KeyName = '';
        if (v.outtype1Key in storeObj.outtype1Key) v.outtype1KeyName = storeObj.outtype1Key[v.outtype1Key];
        else {
            item = storeObj2.outtype1Key.find((vv) => {
                return vv.id == v.outtype1Key;
            });
            if (item) {
                storeObj.outtype1Key[v.outtype1Key] = v.outtype1KeyName = item.name;
            }
        }
        //outtype2Key
        v.outtype2KeyName = '';
        if (v.outtype2Key in storeObj.outtype2Key) v.outtype2KeyName = storeObj.outtype2Key[v.outtype2Key];
        else {
            item = storeObj2.outtype2Key.find((vv) => {
                return vv.id == v.outtype2Key;
            });
            if (item) {
                storeObj.outtype2Key[v.outtype2Key] = v.outtype2KeyName = item.name;
            }
        }
        //bankTypeKey
        v.bankTypeKeyName = '';
        if (v.bankTypeKey in storeObj.bankTypeKey) v.bankTypeKeyName = storeObj.bankTypeKey[v.bankTypeKey];
        else {
            item = storeObj2.bankTypeKey.find((vv) => {
                return vv.id == v.bankTypeKey;
            });
            if (item) {
                storeObj.bankTypeKey[v.bankTypeKey] = v.bankTypeKeyName = item.name;
            }
        }
        //bankKey
        v.bankKeyName = '';
        if (v.bankKey in storeObj.bankKey) v.bankKeyName = storeObj.bankKey[v.bankKey];
        else {
            item = storeObj2.bankKey.find((vv) => {
                return vv.id == v.bankKey;
            });
            if (item) {
                storeObj.bankKey[v.bankKey] = v.bankKeyName = item.name;
            }
        }
        //memberKey
        v.memberKeyName = '';
        if (v.memberKey in storeObj.memberKey) v.memberKeyName = storeObj.memberKey[v.memberKey];
        else {
            item = storeObj2.memberKey.find((vv) => {
                return vv.id == v.memberKey;
            });
            if (item) {
                storeObj.memberKey[v.memberKey] = v.memberKeyName = item.name;
            }
        }
        //for_from_memberKey
        v.for_from_memberKeyName = '';
        if (v.for_from_memberKey in storeObj.memberKey) v.for_from_memberKeyName = storeObj.memberKey[v.for_from_memberKey];
        else {
            item = storeObj2.memberKey.find((vv) => {
                return vv.id == v.for_from_memberKey;
            });
            if (item) {
                storeObj.memberKey[v.for_from_memberKey] = v.for_from_memberKeyName = item.name;
            }
        }
    });
    return _data;
}
// 列表页查询头 控件初始 : outtype1Key\bankTypeKey\memberKey\for_from_memberKey
router.get('/', async (ctx, next) => {
    let jsonResult = await firstDo(ctx);
    ctx.type = 'json';
    ctx.body = jsonResult;
});
// 支出列表
router.post('/', async (ctx, next) => {

    if (!storeObj2.outtype1Key || !storeObj2.outtype2Key || !storeObj2.bankTypeKey || !storeObj2.bankKey || !storeObj2.memberKey) {
        await firstDo(ctx);
    }

    let currentPage = 1,
        pageSize = 10;
    let body = ctx.tool.objItem2num(ctx.request.body, [
        'outtype1Key!!:all',
        'outtype2Key!!:all',
        'intypeKey!!:all',
        'bankTypeKey!!:all',
        'bankKey!!:all',
        'memberKey!!:all',
        'for_from_memberKey!!:all',
        'currentPage',
        'pageSize'
    ]);
    if ('currentPage' in body) currentPage = body.currentPage;
    if ('pageSize' in body) pageSize = body.pageSize;

    let subWhere = '';
    if (body.name) subWhere += ` and name like '%${body.name}%'`;
    if (body.dtype) subWhere += ` and dtype like '%${body.dtype}%'`;
    if (body.other) {
        if (body.other === 'no') {
            subWhere += ` and isOughtNotPay = 1`; //isOughtNotPay
        } else {
            subWhere += ` and other like '%${body.other}%'`; //isOughtNotPay
        }
    }
    if ('outtype1Key' in body && body.outtype1Key !== 'all') subWhere += ` and outtype1Key=${body.outtype1Key}`;
    if ('outtype2Key' in body && body.outtype2Key !== 'all') subWhere += ` and outtype2Key=${body.outtype2Key}`;
    if ('bankTypeKey' in body && body.bankTypeKey !== 'all') subWhere += ` and bankTypeKey=${body.bankTypeKey}`;
    if ('bankKey' in body && body.bankKey !== 'all') subWhere += ` and bankKey=${body.bankKey}`;
    if ('memberKey' in body && body.memberKey !== 'all') subWhere += ` and memberKey=${body.memberKey}`;
    if ('for_from_memberKey' in body && body.for_from_memberKey !== 'all') subWhere += ` and for_from_memberKey=${body.for_from_memberKey}`;
    if (body.date_sign_start) subWhere += ` and date_sign>='${body.date_sign_start}'`;
    if (body.date_sign_end) subWhere += ` and date_sign<='${body.date_sign_end}'`;

    if(ctx.session&&ctx.session.level===1) subWhere += ` and isOughtNotPay=0`;
    let sql = `select * from in_out 
        where type=0 ${subWhere}
        order by date_sign desc, date_dbCreate desc
        limit ${(currentPage-1)*pageSize} , ${pageSize}`;
    // 此处不能用 SQL_CALC_FOUND_ROWS ==>> select FOUND_ROWS()方式，因为用于async/await query，会产生时序滞延
    let sql0 = `select count(id) from in_out 
        where type=0 ${subWhere}
        order by date_sign desc, date_dbCreate desc`;

    let data = await ctx.db.query(sql);
    let dataPage = await ctx.db.query(sql0);

    ctx.type = 'json';
    if (!Array.isArray(dataPage) || dataPage.length === 0) {
        ctx.body = {
            code: 500,
            msg: err
        };
    } else {
        let totalRecord = dataPage[0]['count(id)'],
            pageCount = Math.ceil(totalRecord / pageSize),
            list = build(data, ctx.tool);
        ctx.body = {
            list,
            page: {
                currentPage,
                pageSize,
                pageCount,
                totalRecord
            }
        };
    }


});

module.exports = router;