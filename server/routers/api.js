const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}` });

//for rest-client: GET http://localhost:8888/api/member HTTP/1.1
// 成员类型
router.get('/member',async (ctx, next) => {
    let result = await ctx.db.query('select * from member order by orderd');
    ctx.type = 'json';
    ctx.body = result;
});
//for rest-client: GET http://localhost:8888/api/cometype HTTP/1.1
// 收入类型
router.get('/cometype',async (ctx, next) => {
    let result = await ctx.db.query('select * from intype where isOpen = 1 order by orderd');
    ctx.type = 'json';
    ctx.body = result;
});
//for rest-client: GET http://localhost:8888/api/outypeAll HTTP/1.1
//支出一二级全部
router.get('/outypeAll',async (ctx, next) => {
    let arr = [], o1keys = [];
    let o1 = await ctx.db.query('select * from outtype1 where isOpen = 1 order by orderd');
    let o2 = await ctx.db.query('select * from outtype2 where 1 = 1 order by orderd');
    arr = o1.sort((a,b)=>a.orderd-b.orderd).map(item=>{
        o1keys.push(item.id);
        return {name: item.name, value: ''+item.id, parent: '0'};
    });
    o1keys.forEach(key=>{
        o2.filter(item=>item.outType1Key===key).sort((a,b)=>a.orderd-b.orderd).forEach(item=>{
            arr.push({name: item.name, value: ''+item.id, parent: ''+key});
        });
    });
    ctx.type = 'json';
    ctx.body = arr;
});
//for rest-client: GET http://localhost:8888/api/outype1 HTTP/1.1
// 支出类型一级
router.get('/outype1',async (ctx, next) => {
    let result = await ctx.db.query('select * from outtype1 where isOpen = 1 order by orderd');
    ctx.type = 'json';
    ctx.body = result;
});
// 支出类型二级
router.get('/outype2/:id',async (ctx, next) => {
    let result = await ctx.db.query('select * from outtype2 where outType1Key = ? order by orderd', ctx.params.id);
    ctx.type = 'json';
    ctx.body = result;
});
//for rest-client: GET http://localhost:8888/api/moneyTypeAll HTTP/1.1
//币种一二级全部
router.get('/moneyTypeAll',async (ctx, next) => {
    let arr = [];
    let o1 = await ctx.db.query('select * from banktype order by orderd');
    let o2 = await ctx.db.query('select * from bank where 1 = 1 order by orderd');
    arr = o1.sort((a,b)=>a.orderd-b.orderd).map(item=>{
        return {name: item.name, value: ''+item.id, parent: '0'};
    });
    o1.forEach(o1Item=>{
        o2.filter(item=>item.bankType===o1Item.type).sort((a,b)=>a.orderd-b.orderd).forEach(item=>{
            arr.push({name: item.name, value: ''+item.id, parent: ''+o1Item.id});
        });
    });
    ctx.type = 'json';
    ctx.body = arr;
});
//for rest-client: GET http://localhost:8888/api/moneyTypes HTTP/1.1
// 币种类型一级
router.get('/moneyTypes',async (ctx, next) => {
    let result = await ctx.db.query('select * from banktype order by orderd');
    ctx.type = 'json';
    ctx.body = result;
});
//for rest-client: GET http://localhost:8888/api/banks/4 HTTP/1.1
// 币种类型二级
router.get('/banks/:id',async (ctx, next) => {
    let result = await ctx.db.query('select * from bank where bankType = (select type from banktype where id = ?) order by orderd', ctx.params.id);
    ctx.type = 'json';
    ctx.body = result;
});
//for rest-client: GET http://localhost:8888/api/banks/4 HTTP/1.1
// 币种类型二级
router.get('/banksByType/:type',async (ctx, next) => {
    let result = await ctx.db.query('select * from bank where bankType = ? order by orderd', ctx.params.type);
    ctx.type = 'json';
    ctx.body = result;
});
// 单 删收入、支出列表项
router.get('/del_listPayIncome/:id',async (ctx, next) => {
    let result = await ctx.db.query('delete from in_out where id = ?', ctx.params.id);
    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            str += `delete from in_out where id = ${ctx.params.id};`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    ctx.type = 'json';
    ctx.body = result;
});
// 批 删收入、支出列表项
router.post('/delAll_listPayIncome',async (ctx, next) => {
    const ids = ctx.request.body.ids;
    let result = await ctx.db.query(`delete from in_out where id in (${ids})`);
    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        let ifOpen = !!(str.indexOf('mode=open')>-1);
        if(ifOpen){
            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
            str += `delete from in_out where id in (${ids});`;
            str += `\r\n---------------:end`;
            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
        }
    }
    ctx.type = 'json';
    ctx.body = result;
});
// 获取当前登录用户信息
router.get('/getUserInfo', async (ctx, next) => {
    let re =  { name: 'smbd', level: 1};
    if(ctx.session && ctx.session.user) {
        re = {
			name: ctx.session.user.name,
            sname: ctx.session.user.sname,
            level: ctx.session.level
        };
    }
    ctx.type = 'json';
    ctx.body = re;
});
// 获取所有银行（只是银行）
router.get('/banksOnly', async (ctx, next) => {
    let result = await ctx.db.query('select * from bank where bankType = 0 order by orderd');
    ctx.type = 'json';
    ctx.body = result;
});
// 类目编辑： 增、改
router.post('/stype/addOrEdit',async (ctx, next) => {
	//req.body: { optType: 'edit', tableType: 'outtype2', id: '109', name: '其它', order: '100', ifHome: '0', pid: '9' }
    let body = ctx.request.body, sql, params = {name: body.name, orderd: +body.order};
    if(body.optType==='edit'){
        sql = `update ${body.tableType} set ? where id = ${body.id}`;
    }else if(body.optType==='add'){
		sql = `insert into ${body.tableType} set ?`;
	    if(body.tableType==='bank') params.bankType = 0;
	    else if(body.tableType==='outtype2') params.outType1Key = +body.pid;
	}
    if(body.tableType==='member') params.ifhome = +body.ifHome;
    let result = await ctx.db.query(sql, params);
	ctx.type = 'json';
    ctx.body = result;
});
// 类目编辑： 删
router.post('/stype/del',async (ctx, next) => {
	//req.body: { tableType: 'outtype2', id: '109'}
    let tab = ctx.request.body.tableType, id = ctx.request.body.id;
    let sql, param;
    if(tab==='intype' || tab==='outtype1'){//intype与outtype1的操作为isOpen字段关闭（设为0）
    	sql = `update ${tab} set ? where id = ${id}`;
    	param = {isOpen:0};
    }else if(tab==='outtype2'||tab==='bank'||tab==='member'){//member、outtype2、bank的操作为物理删，直接在库中把该记录删除
    	sql = `delete from ${tab} where id = ?`;
	    param = id;
    }
	let result = await ctx.db.query(sql, param);
    ctx.type = 'json';
    ctx.body = result;
});

module.exports = router;