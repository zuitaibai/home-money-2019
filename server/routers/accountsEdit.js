const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/accounts` });

//for rest-client: GET http://localhost:8888/api/accounts/48 HTTP/1.1
// 获取帐目 详情
router.get('/:id', async (ctx, next) => {

    let id = ctx.params.id;
    let dataItem = await ctx.db.query('select * from zhuan_cun where id = ?', id);

    ctx.type = 'json';
    ctx.body = {
        name: dataItem[0].name,
        money: dataItem[0].money,
        type: dataItem[0].type,
        date_sign: ctx.tool.dateFmt(dataItem[0].date_sign),
        bankTypeKey_from: dataItem[0].bankTypeKey_from,
        bankTypeKey_to: dataItem[0].bankTypeKey_to,
        bankKey_from: dataItem[0].bankKey_from,
        bankKey_to: dataItem[0].bankKey_to,
        memberKey_from: dataItem[0].memberKey_from,
        memberKey_to: dataItem[0].memberKey_to,
        dtype: dataItem[0].dtype,
        other: dataItem[0].other,
        isOughtNotPay: dataItem[0].isOughtNotPay,
		id: dataItem[0].id
    };
});
// 提交帐目 详情编辑
router.post('/update/:id', async (ctx, next) => {
    id = ctx.params.id;
    let params = ctx.tool.objItem2num(ctx.request.body,['type','money','bankTypeKey_from','bankKey_from','memberKey_from','bankTypeKey_to','bankKey_to','memberKey_to']);
    if(!params.date_sign) params.date_sign = ctx.tool.dateFmt(Date.now());
    if(params.other==='no'){ params.other=''; params.isOughtNotPay = 1; }
    else if(params.other==='yes'){ params.other=''; params.isOughtNotPay = 0; }
    let result =await ctx.db.query('update zhuan_cun set ? where id = '+id, params);

    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            let arr = [], numKeys = ['type','money','bankTypeKey_from','bankKey_from','memberKey_from','bankTypeKey_to','bankKey_to','memberKey_to','isOughtNotPay'];
            for(let i in params){
                let v = params[i];
                if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                arr.push(`${i} = ${v}`);
            }
            str += `UPDATE zhuan_cun SET  ${arr.join(' , ')}  WHERE id = ${id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    ctx.type = 'json';
    ctx.body = result;

});
// 添加帐目 详情
router.post('/add',async (ctx, next) => {
    let params = ctx.tool.objItem2num(ctx.request.body,['type','money','bankTypeKey_from','bankKey_from','memberKey_from','bankTypeKey_to','bankKey_to','memberKey_to']);
    if(!params.date_sign) params.date_sign = ctx.tool.dateFmt(Date.now());
    params.date_dbCreate = ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss');
    if(params.other==='no'){ params.other=''; params.isOughtNotPay = 1; }
    let selectSql = `select count(*) as count from zhuan_cun where bankTypeKey_to=${params.bankTypeKey_to} and bankKey_to=${params.bankKey_to} and memberKey_to=${params.memberKey_to} and type=0`;
    let insertSql = `insert into zhuan_cun set ?`;

    let insertDo = async ()=> {
        let result = await ctx.db.query(insertSql,params);
        if(fs.existsSync(`data_ser/writeSql.txt`)){
            let str = fs.readFileSync('data_ser/writeSql.txt').toString();
            let ifOpen = !!(str.indexOf('mode=open')>-1);
            if(ifOpen){
                let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
                let keys = [], vals = [], numKeys = ['type','money','bankTypeKey_from','bankKey_from','memberKey_from','bankTypeKey_to','bankKey_to','memberKey_to','isOughtNotPay'];
                for(let i in params){
                    keys.push(i);
                    let v = params[i];
                    if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                    vals.push(v);
                }
                str += `INSERT INTO zhuan_cun (${keys.join(',')}) VALUES (${vals.join(',')});`;
                str += `\r\n---------------:end`;
                fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
            }
        }
        return result;
    };

    let sDataResult;
    if(params.type==0){
        let data = await ctx.db.query(selectSql);
        if(data[0].count==0){
            sDataResult = await insertDo();
        }else{
            sDataResult = {isExistCung:'yet', status:'fail'};
        }
    }else{
        sDataResult = await insertDo();
    }
    ctx.type = 'json';
    ctx.body = sDataResult;

});


module.exports = router;