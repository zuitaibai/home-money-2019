const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/listAccounts` });

let storeObj = {//存键值
    bankTypeKey: {},
    bankKey: {},
    memberKey: {}
};
let storeObj2 = {//存键名
    bankTypeKey: null,
    bankKey:null,
    memberKey: null,
};

async function firstDo(ctx) {
    let getBankType = ctx.db.query('select * from banktype order by orderd');
    let getBank = ctx.db.query('select * from bank order by orderd');
    let member = ctx.db.query('select * from member where ifhome=1 order by orderd');
    let data = await Promise.all([getBankType,member,getBank]);
    storeObj2.bankTypeKey = data[0];
    storeObj2.bankKey = data[2];
    storeObj2.memberKey = data[1];
}

function build(data, tool) {
    let _data = data ? tool.objDateItemFmt(data,{'date_sign':'yyyy-MM-dd','date_dbCreate':'yyyy-MM-dd hh:mm:ss'}) : [];
    //填充对象：分类、币种、账户的名称
    _data.forEach((v)=>{
        let item;
        //bankTypeKey
        v.bankTypeKey_fromName = v.bankTypeKey_toName = '';
        if(v.bankTypeKey_from in storeObj.bankTypeKey) v.bankTypeKey_fromName = storeObj.bankTypeKey[v.bankTypeKey_from];
        else{
            item = storeObj2.bankTypeKey.find((vv)=>{ return vv.id == v.bankTypeKey_from; });
            if(item){
                storeObj.bankTypeKey[v.bankTypeKey_from] = v.bankTypeKey_fromName = item.name;
            }
        }
        if(v.bankTypeKey_to in storeObj.bankTypeKey) v.bankTypeKey_toName = storeObj.bankTypeKey[v.bankTypeKey_to];
        else{
            item = storeObj2.bankTypeKey.find((vv)=>{ return vv.id == v.bankTypeKey_to; });
            if(item){
                storeObj.bankTypeKey[v.bankTypeKey_to] = v.bankTypeKey_fromName = item.name;
            }
        }
        //bankKey
        v.bankKey_fromName = v.bankKey_toName ='';
        if(v.bankKey_from in storeObj.bankKey) v.bankKey_fromName = storeObj.bankKey[v.bankKey_from];
        else{
            item = storeObj2.bankKey.find((vv)=>{ return vv.id == v.bankKey_from; });
            if(item){
                storeObj.bankKey[v.bankKey_from] = v.bankKey_fromName = item.name;
            }
        }
        if(v.bankKey_to in storeObj.bankKey) v.bankKey_toName = storeObj.bankKey[v.bankKey_to];
        else{
            item = storeObj2.bankKey.find((vv)=>{ return vv.id == v.bankKey_to; });
            if(item){
                storeObj.bankKey[v.bankKey_to] = v.bankKey_toName = item.name;
            }
        }
        //memberKey
        v.memberKey_fromName = v.memberKey_toName = '';
        if(v.memberKey_from in storeObj.memberKey) v.memberKey_fromName = storeObj.memberKey[v.memberKey_from];
        else{
            item = storeObj2.memberKey.find((vv)=>{ return vv.id == v.memberKey_from; });
            if(item){
                storeObj.memberKey[v.memberKey_from] = v.memberKey_fromName = item.name;
            }
        }
        if(v.memberKey_to in storeObj.memberKey) v.memberKey_toName = storeObj.memberKey[v.memberKey_to];
        else{
            item = storeObj2.memberKey.find((vv)=>{ return vv.id == v.memberKey_to; });
            if(item){
                storeObj.memberKey[v.memberKey_to] = v.memberKey_toName = item.name;
            }
        }
    });
    return _data;
}
// 帐目列表
router.post('/', async (ctx, next) => {

    if (!storeObj2.bankTypeKey || !storeObj2.bankKey || !storeObj2.memberKey) {
        await firstDo(ctx);
    }

    let currentPage = 1, pageSize = 10;
    let body = ctx.tool.objItem2num(ctx.request.body,[ 'type!!:all', 'currentPage', 'pageSize' ]);
    if('currentPage' in body) currentPage = body.currentPage;
    if('pageSize' in body) pageSize = body.pageSize;

    let subWhere = '';
    if(body.name) subWhere += ` and name like '%${body.name}%'`;
    if(body.dtype) subWhere += ` and dtype like '%${body.dtype}%'`;
    if(body.other) subWhere += ` and other like '%${body.other}%'`;
    if('type' in body){
        if(body.type==-100000) subWhere += ` and type!=100`;
        else if(body.type!=='all') subWhere += ` and type=${body.type}`;
    }
    if(body.date_sign_start) subWhere += ` and date_sign>='${body.date_sign_start}'`;
    if(body.date_sign_end) subWhere += ` and date_sign<='${body.date_sign_end}'`;
    if(ctx.session&&ctx.session.level===1) subWhere += ` and isOughtNotPay=0`;
    let sql = `select * from zhuan_cun 
                    where 1=1 ${subWhere}
                    order by date_sign desc, date_dbCreate desc
                    limit ${(currentPage-1)*pageSize} , ${pageSize}`;
        // 此处不能用 SQL_CALC_FOUND_ROWS ==>> select FOUND_ROWS()方式，因为用于async/await query，会产生时序滞延
    let sql0 = `select  count(id) from zhuan_cun 
        where 1=1 ${subWhere}
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
// 单 删帐目列表项
router.get('/del/:id', async (ctx, next) => {
    let result = await ctx.db.query('delete from zhuan_cun where id = ?', ctx.params.id);
    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            str += `delete from zhuan_cun where id = ${ctx.params.id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    ctx.type = 'json';
    ctx.body = result;
});
// 批 删帐目列表项
router.post('/delAll', async (ctx, next) => {
    let ids = ctx.request.body.ids;
    let result = await ctx.db.query(`delete from zhuan_cun where id in (${ids})`);
    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            str += `delete from zhuan_cun where id in (${ids});`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    ctx.type = 'json';
    ctx.body = result;
});

module.exports = router;