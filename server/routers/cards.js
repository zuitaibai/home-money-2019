const Router = require('koa-router');

const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/cards` });
// 卡号列表
router.post('/', async (ctx, next) => {

    let banktypes = {'2':'借记卡','3':'信用卡','5':'其它'}, members={}, banks={};
    let fmtNums =function(str){ return str.replace(/\s/g,'').replace(/(.{4})/g,"$1 "); };
    let data = await Promise.all([
        ctx.db.query('select * from member where ifhome=1'),
        ctx.db.query('select * from bank where bankType=0')
    ]);
    data[0].forEach(v=>members[v.id]=v.name);
    data[1].forEach(v=>banks[v.id]=v.name);
    let whereSub = ' 1 = 1';
    if(ctx.session && ctx.session.level===1) whereSub = ' if_show = 1';
    let sql =  `select * from cards  where ${whereSub}`;
    let datas = await ctx.db.query(sql);

    let rdata = {};
    datas.forEach(v=>{
        v.bankName = banks[v.bankKey];
        v.memberName = members[v.memberKey];
        v.bankTypeName = banktypes[v.bankTypeKey];
        v.num2 = fmtNums(v.num);
        v.validityPeriod = v.validityPeriod || '';
        v.threeNum = v.threeNum || '';
        v.other = v.other || '';
        if(!(v.memberKey in rdata)) rdata[v.memberKey] = {};
        if(v.bankTypeKey in rdata[v.memberKey]){
            rdata[v.memberKey][v.bankTypeKey].push(v);
        }else{
            rdata[v.memberKey][v.bankTypeKey] = [v];
        }
    });
    
    ctx.type = 'json';
    ctx.body = {
        list: rdata,
        banktypes,
        members,
        banks
    };

});
// 删除卡号
router.post('/del/:id', async (ctx, next) => {
    let result = await ctx.db.query('delete from cards where id = ?', ctx.params.id);
    ctx.type = 'json';
    ctx.body = result;
});
// 编辑卡号
router.post('/edit/:id', async (ctx, next) => {
    let sbody = ctx.request.body || {};
    let result = await ctx.db.query('update cards set ? where id = '+ctx.params.id, sbody);
    ctx.type = 'json';
    ctx.body = result;
});
// 添加卡号
router.post('/add', async(ctx, next) => {
    let sbody = ctx.request.body || {};
    let result = await ctx.db.query('insert into cards set ?', sbody);
    ctx.type = 'json';
    ctx.body = result;
});

module.exports = router;