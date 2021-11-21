const Router = require('koa-router');
const fs = require('fs');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/accounts` });

//for rest-client: GET http://localhost:8888/api/accounts/48 HTTP/1.1
// 获取帐目 详情
router.get('/:id', async (ctx, next) => {

    let id = ctx.params.id;
    let dataItem = await ctx.db.query('select * from zhuan_cun where id = ?', id);
    let finisheds = {};
    if(dataItem[0].finishedFormIds){
        let sum = await ctx.db.query(`SELECT SUM(money) as summ FROM zhuan_cun WHERE id in (${dataItem[0].finishedFormIds})`);
        let list = await ctx.db.query(`SELECT * FROM zhuan_cun WHERE id in (${dataItem[0].finishedFormIds})`);
        finisheds.sum = sum[0].summ;
        finisheds.count = list.length;
        finisheds.list = list;
    }



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
		id: dataItem[0].id,
        otherpartyName: dataItem[0].otherpartyName || '',
        finishedFormIds: dataItem[0].finishedFormIds || '',
        isFinished: dataItem[0].isFinished,
        finisheds
    };
});
// 编辑帐目 详情编辑
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
            let arr = [], numKeys = ['type','money','bankTypeKey_from','bankKey_from','memberKey_from','bankTypeKey_to','bankKey_to','memberKey_to','isOughtNotPay', 'otherpartyName'];
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


    //如果编辑成功（编辑时也许动了钱数）
    if (result.affectedRows == 1 && result.changedRows == 1) {
        let myRecord = await ctx.db.query('select type,money,finishedFormIds,isFinished from zhuan_cun WHERE id = ?', id);
        //如果是还出或还入，对应的主记录id页面只读，不可改。所以不用考虑再更新主记录的finishedFormIds和自身的finishedFormIds。
        //即：还入和还出的帐目对应，只能在新增还入和还出的时候一次定型（除了删除）。
        //即：还给别人或别人还给自己，依据现实有一笔生成一笔，日后只能改名字钱数等(和主记录对应方面无关的信息)，或者删除。

        //如果是还出或还入：同时更新所对应的主记录的isFinished
        if(myRecord[0].type == 2 || myRecord[0].type == -2){
            let mainRecord = await ctx.db.query('select id,money,finishedFormIds,isFinished from zhuan_cun WHERE id = (select finishedFormIds from zhuan_cun where id = ?)', id);
            let ids = mainRecord[0].finishedFormIds.split(',');
            ids = ids.filter(item => item != '' && item != ' ' && item);
            let summ = await ctx.db.query(`SELECT SUM(money) as summ FROM zhuan_cun WHERE id in (${ids.join(',')})`);
            var sumMmyy = +summ[0].summ;
            let isFinished = 0;
            if(sumMmyy !== 0){
                isFinished = 2;
                if(sumMmyy >= +mainRecord[0].money) isFinished = 1;
            }
            //更新还入或还出所对应的帐目的isFinished字段为0,1或2
            let updateMainRecord = await ctx.db.query('update zhuan_cun set ? where id = '+mainRecord[0].id, {isFinished});

            if(fs.existsSync(`data_ser/writeSql.txt`)){
                let str = fs.readFileSync('data_ser/writeSql.txt').toString();
                let ifOpen = !!(str.indexOf('mode=open')>-1);
                if(ifOpen){
                    let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
                    str += `UPDATE zhuan_cun SET isFinished=${isFinished}  WHERE id = ${mainRecord[0].id};`;
                    str += `\r\n---------------:end`;
                    fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
                }
            }

        }

        //如果是借出或借入：页面不给修改与次记录(还入还出)对应方面的入口，也不能改第一次输入的对方姓名

        //如果是借出或借入：更新自己的isFinished
        else if(myRecord[0].type == 1 || myRecord[0].type == -1){
            let ids = myRecord[0].finishedFormIds.split(',');
            ids = ids.filter(item => item != '' && item != ' ' && item);
            let summ = await ctx.db.query(`SELECT SUM(money) as summ FROM zhuan_cun WHERE id in (${ids.join(',')})`);
            var sumMmyy = +summ[0].summ;
            let isFinished = 0;
            if(sumMmyy !== 0){
                isFinished = 2;
                if(sumMmyy >= +myRecord[0].money) isFinished = 1;
            }
            //更新此借出或借入的isFinished字段为0,1或2
            let updateMyRecord = await ctx.db.query('update zhuan_cun set ? where id = '+id, {isFinished});

            if(fs.existsSync(`data_ser/writeSql.txt`)){
                let str = fs.readFileSync('data_ser/writeSql.txt').toString();
                let ifOpen = !!(str.indexOf('mode=open')>-1);
                if(ifOpen){
                    let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
                    str += `UPDATE zhuan_cun SET isFinished=${isFinished}  WHERE id = ${id};`;
                    str += `\r\n---------------:end`;
                    fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
                }
            }

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

    if(params.finishedFormIds && (params.type == 2 || params.type == -2)){
        //查询还入或还出所对应的帐目
        let selectTo = await ctx.db.query('select otherpartyName from zhuan_cun where id = ?', +params.finishedFormIds);
        if(selectTo[0].otherpartyName) params.otherpartyName = selectTo[0].otherpartyName;
    }

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


    //添加成功后
    if(sDataResult.affectedRows == 1 && sDataResult.insertId){
        //如果添加的是还入或还出
        if(params.finishedFormIds && (params.type == 2 || params.type == -2)){
            //查询还入或还出所对应的帐目
            let selectTo = await ctx.db.query('select money,type,finishedFormIds,isFinished from zhuan_cun where id = ?', +params.finishedFormIds);
            let ids = selectTo[0].finishedFormIds.split(',');
            ids = ids.filter(item => item != '' && item != ' ' && item);
            ids.push(sDataResult.insertId);
            let obj = {finishedFormIds: ids.join(',')};
            //更新还入或还出所对应的帐目的finishedFormIds字段为形如: 56,59
            let updateTo = await ctx.db.query('update zhuan_cun set ? where id = '+params.finishedFormIds, obj);
            if(updateTo.affectedRows == 1 && updateTo.changedRows == 1){
                //查询 还入或还出所对应的帐目的finishedFormIds字段的值（如56,59）各个所对应的记录的钱数和
                let summ = await ctx.db.query(`SELECT SUM(money) as summ FROM zhuan_cun WHERE id in (${obj.finishedFormIds})`);
                var sumMmyy = +summ[0].summ;
                let isFinished = 0;
                if(sumMmyy !== 0){
                    isFinished = 2;
                    if(sumMmyy >= +selectTo[0].money) isFinished = 1;
                }
                //更新还入或还出所对应的帐目的isFinished字段为0,1或2
                let updateTo2 = await ctx.db.query('update zhuan_cun set ? where id = '+params.finishedFormIds, {isFinished});
                if(updateTo2.affectedRows == 1 && updateTo2.changedRows == 1){
                    if(fs.existsSync(`data_ser/writeSql.txt`)){
                        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
                        let ifOpen = !!(str.indexOf('mode=open')>-1);
                        if(ifOpen){
                            let str = `\r\n\r\n\r\n\r\n${ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd hh:mm:ss')}\r\n------------------------------start:\r\n`;
                            str += `UPDATE zhuan_cun SET finishedFormIds=\'${obj.finishedFormIds}\'  WHERE id = ${params.finishedFormIds};`;
                            str += '\r\n';
                            str += `UPDATE zhuan_cun SET isFinished=${isFinished}  WHERE id = ${params.finishedFormIds};`;
                            str += `\r\n---------------:end`;
                            fs.appendFileSync('data_ser/writeSql.txt', str, function () { });
                        }
                    }
                }
            }
        }
    }


    ctx.type = 'json';
    ctx.body = sDataResult;

});


module.exports = router;