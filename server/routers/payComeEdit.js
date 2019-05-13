const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/detail` });

//for rest-client: GET http://localhost:8888/api/detail/584 HTTP/1.1
// 获取收入/支出 详情
router.get('/:id', async (ctx, next) => {

    let id = ctx.params.id;
    let dataItem = await ctx.db.query('select * from in_out where id = ?', id);

    ctx.type = 'json';
    ctx.body = {
        name: dataItem[0].name,
        money: dataItem[0].money,
        outtype1Key: dataItem[0].outtype1Key,
        outtype2Key: dataItem[0].outtype2Key,
        intypeKey: dataItem[0].intypeKey,
        bankTypeKey: dataItem[0].bankTypeKey,
        bankKey: dataItem[0].bankKey,
        memberKey: dataItem[0].memberKey,
        for_from_memberKey: dataItem[0].for_from_memberKey,
        date_sign: ctx.tool.dateFmt(dataItem[0].date_sign),
        date_dbCreate: ctx.tool.dateFmt(dataItem[0].date_dbCreate),
        other: dataItem[0].other,
        dtype: dataItem[0].dtype,
        isOughtNotPay: dataItem[0].isOughtNotPay,
		id: dataItem[0].id
    };
});
// 提交收入/支出 详情编辑
router.post('/update/:id', async (ctx, next) => {
    id = ctx.params.id;
    let params = ctx.tool.objItem2num(ctx.request.body,['type','money','outtype1Key','outtype2Key','intypeKey','bankTypeKey','bankKey','memberKey','for_from_memberKey']);
    if(!params.date_sign) params.date_sign = ctx.tool.dateFmt(Date.now());
    if(params.other==='no'){ params.other=''; params.isOughtNotPay = 1; }
    else if(params.other==='yes'){ params.other=''; params.isOughtNotPay = 0; }
    let result = await ctx.db.query('update in_out set ? where id = '+id, params);

    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            let arr = [], numKeys = ['type','money','outtype1Key','outtype2Key','intypeKey','bankTypeKey','bankKey','memberKey','for_from_memberKey','isOughtNotPay'];
            for(let i in params){
                let v = params[i];
                if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                arr.push(`${i} = ${v}`);
            }
            str += `UPDATE in_out SET  ${arr.join(' , ')}  WHERE id = ${id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }

    ctx.type = 'json';
    ctx.body =result;

});
// 添加收入/支出 详情
router.post('/add',async (ctx, next) => {
    let params = ctx.tool.objItem2num(ctx.request.body,['type','money','outtype1Key','outtype2Key','intypeKey','bankTypeKey','bankKey','memberKey','for_from_memberKey']);
    if(!params.date_sign) params.date_sign = ctx.tool.dateFmt(Date.now());
    params.date_dbCreate = ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss');
    if(params.other==='no'){ params.other=''; params.isOughtNotPay = 1; }
    let result = await ctx.db.query('insert into in_out set ?', params);

    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            let keys = [], vals = [], numKeys = ['type','money','outtype1Key','outtype2Key','intypeKey','bankTypeKey','bankKey','memberKey','for_from_memberKey','isOughtNotPay'];
            for(let i in params){
                keys.push(i);
                let v = params[i];
                if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                vals.push(v);
            }
            str += `INSERT INTO in_out (${keys.join(',')}) VALUES (${vals.join(',')});`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    
    ctx.type = 'json';
    ctx.body =result;

});


module.exports = router;