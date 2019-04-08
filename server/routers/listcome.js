const Router = require('koa-router');

const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/listCome` });

let storeObj = {//存键值
    intypeKey: {},
    bankTypeKey: {},
    bankKey: {},
    memberKey: {}
};
let storeObj2 = {//存键名
    intypeKey: null,
    bankTypeKey: null,
    bankKey:null,
    memberKey: null,
};

async function firstDo(ctx) {
    let getIntypeKey = ctx.db.query('select * from intype where isOpen = 1 order by orderd');
    let getBankType = ctx.db.query('select * from banktype order by orderd');
    let getBank = ctx.db.query('select * from bank order by orderd');
    let member = ctx.db.query('select * from member where ifhome=1 order by orderd');
    let data = await Promise.all([getIntypeKey,getBankType,member,getBank]);
    storeObj2.intypeKey = data[0];
    storeObj2.bankTypeKey = data[1];
    storeObj2.bankKey = data[3];
    storeObj2.memberKey = data[2];
    return {
        intypeKey: data[0]
    }
}

function build(data, tool) {
    let _data = data ? tool.objDateItemFmt(data,{'date_sign':'yyyy-MM-dd','date_dbCreate':'yyyy-MM-dd hh:mm:ss'}) : [];
    //填充对象：分类、币种、账户的名称
    _data.forEach((v)=>{
        let item;
        //intypeKey
        v.intypeKeyName = '';
        if(v.intypeKey in storeObj.intypeKey) v.intypeKeyName = storeObj.intypeKey[v.intypeKey];
        else{
            item = storeObj2.intypeKey.find((vv)=>{ return vv.id == v.intypeKey; });
            if(item){
                storeObj.intypeKey[v.intypeKey] = v.intypeKeyName = item.name;
            }
        }
        //bankTypeKey
        v.bankTypeKeyName = '';
        if(v.bankTypeKey in storeObj.bankTypeKey) v.bankTypeKeyName = storeObj.bankTypeKey[v.bankTypeKey];
        else{
            item = storeObj2.bankTypeKey.find((vv)=>{ return vv.id == v.bankTypeKey; });
            if(item){
                storeObj.bankTypeKey[v.bankTypeKey] = v.bankTypeKeyName = item.name;
            }
        }
        //bankKey
        v.bankKeyName = '';
        if(v.bankKey in storeObj.bankKey) v.bankKeyName = storeObj.bankKey[v.bankKey];
        else{
            item = storeObj2.bankKey.find((vv)=>{ return vv.id == v.bankKey; });
            if(item){
                storeObj.bankKey[v.bankKey] = v.bankKeyName = item.name;
            }
        }
        //memberKey
        v.memberKeyName = '';
        if(v.memberKey in storeObj.memberKey) v.memberKeyName = storeObj.memberKey[v.memberKey];
        else{
            item = storeObj2.memberKey.find((vv)=>{ return vv.id == v.memberKey; });
            if(item){
                storeObj.memberKey[v.memberKey] = v.memberKeyName = item.name;
            }
        }
    });
    return _data;
}
// 列表页查询头 控件初始 : intypeKey
router.get('/', async (ctx, next) => {
    let jsonResult = await firstDo(ctx);
    ctx.type = 'json';
    ctx.body = jsonResult;
});
// 收入列表
router.post('/', async (ctx, next) => {

    if (!storeObj2.intypeKey || !storeObj2.bankTypeKey || !storeObj2.bankKey || !storeObj2.memberKey) {
        await firstDo(ctx);
    }
    
    let currentPage = 1, pageSize = 10;
    let body = ctx.tool.objItem2num(ctx.request.body,[
        'outtype1Key!!:all',
        'outtype2Key!!:all',
        'intypeKey!!:all',
        'bankTypeKey!!:all',
        'bankKey!!:all',
        'memberKey!!:all',
        'currentPage',
        'pageSize'
    ]);
    if('currentPage' in body) currentPage = body.currentPage;
    if('pageSize' in body) pageSize = body.pageSize;

    let subWhere = '';
    if(body.name) subWhere += ` and name like '%${body.name}%'`;
    if(body.dtype) subWhere += ` and dtype like '%${body.dtype}%'`;
    if(body.other) subWhere += ` and other like '%${body.other}%'`;
    if('intypeKey' in body && body.intypeKey!=='all') subWhere += ` and intypeKey=${body.intypeKey}`;
    if('bankTypeKey' in body && body.bankTypeKey!=='all') subWhere += ` and bankTypeKey=${body.bankTypeKey}`;
    if('bankKey' in body && body.bankKey!=='all') subWhere += ` and bankKey=${body.bankKey}`;
    if('memberKey' in body && body.memberKey!=='all') subWhere += ` and memberKey=${body.memberKey}`;
    if(body.date_sign_start) subWhere += ` and date_sign>='${body.date_sign_start}'`;
    if(body.date_sign_end) subWhere += ` and date_sign<='${body.date_sign_end}'`;
    if(body.date_sign_end) subWhere += ` and date_sign<='${body.date_sign_end}'`;
    if(ctx.session&&ctx.session.level===1) subWhere += ` and isOughtNotPay=0`;
    let sql = `select * from in_out 
                where type=1 ${subWhere}
                order by date_sign desc, date_dbCreate desc
                limit ${(currentPage-1)*pageSize} , ${pageSize}`;
    // 此处不能用 SQL_CALC_FOUND_ROWS ==>> select FOUND_ROWS()方式，因为用于async/await query，会产生时序滞延
    let sql0 = `select  count(id) from in_out 
        where type=1 ${subWhere}
        order by date_sign desc, date_dbCreate desc`;
    let data = await ctx.db.query(sql);
    let dataPage = await ctx.db.query(sql0);

    ctx.type = 'json';
    if(!Array.isArray(dataPage) || dataPage.length===0){
        ctx.body = {
            code: 500,
            msg: err
        };
    }else{
        let totalRecord = dataPage[0]['count(id)'], pageCount = Math.ceil(totalRecord/pageSize);
        let list = build(data, ctx.tool);
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