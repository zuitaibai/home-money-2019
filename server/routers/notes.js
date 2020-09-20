const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/notes` });
// 记事列表
router.post('/', async (ctx, next) => {
    let data = await ctx.db.query('select * from note');
    data = data ? ctx.tool.objDateItemFmt(data, {
        'date_sign': 'yyyy-MM-dd',
        'date_dbCreate': 'yyyy-MM-dd hh:mm:ss'
    }) : [];

    ctx.type = 'json';
    ctx.body = {
        list: data
    };

});
// 删除记事
router.post('/del/:id', async (ctx, next) => {
    let result = await ctx.db.query('delete from note where id = ?', ctx.params.id);

    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            str += `delete from note where id = ${ctx.params.id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }

    ctx.type = 'json';
    ctx.body = result;
});
// 编辑记事
router.post('/edit/:id', async (ctx, next) => {
    let sbody = ctx.request.body || {};
    let result = await ctx.db.query('update note set ? where id = '+ctx.params.id, sbody);

    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            let arr = [], numKeys = ['sname','date_sign','dtype','con'];
            for(let i in sbody){
                let v = sbody[i];
                if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                arr.push(`${i} = ${v}`);
            }
            str += `UPDATE into SET ${arr.join(' , ')}  WHERE id = ${ctx.params.id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }

    ctx.type = 'json';
    ctx.body = result;
});
// 添加记事
router.post('/add', async(ctx, next) => {
    let sbody = ctx.request.body || {};
    sbody.date_dbCreate = ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss');
    let result = await ctx.db.query('insert into note set ?', sbody);


    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            let keys = [], vals = [], numKeys = ['sname','date_sign','dtype','con'];
            for(let i in sbody){
                keys.push(i);
                let v = sbody[i];
                if(numKeys.indexOf(i)===-1) v = `\'${v||''}\'`;
                vals.push(v);
            }
            str += `INSERT INTO note (${keys.join(',')}) VALUES (${vals.join(',')});`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }


    ctx.type = 'json';
    ctx.body = result;
});

module.exports = router;