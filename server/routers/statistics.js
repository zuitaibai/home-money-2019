const Router = require('koa-router');

const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/listStatistics` });
// 首页数据块 总览  // 统计列表
router.post('/', async (ctx, next) => {
    let currentPage = 1,
        pageSize = 10,
        schType = 'month';
    let body = ctx.tool.objItem2num(ctx.request.body, ['currentPage', 'pageSize']);
    if ('currentPage' in body) currentPage = body.currentPage;
    if ('pageSize' in body) pageSize = body.pageSize;
    if ('tongjidw' in body) schType = body.tongjidw;
    let subWhere = '';
    if (body.date_sign_start) subWhere += ` and date_sign>='${body.date_sign_start}'`;
    if (body.date_sign_end) subWhere += ` and date_sign<='${body.date_sign_end}'`;
    if (ctx.session&&ctx.session.level === 1) subWhere += ` and isOughtNotPay=0`;

    let createSql = partSql => {
        //`SELECT DATE_FORMAT(date_sign,'%Y')       as years, sum(money)  as sums FROM zhuan_cun WHERE type=1 ${subWhere}  GROUP BY years`
        //`SELECT DATE_FORMAT(date_sign,'%Y-%m')    as months, sum(money) as sums FROM zhuan_cun WHERE type=1 ${subWhere}  GROUP BY months`
        //`SELECT DATE_FORMAT(date_sign,'%Y-%m-%d') as days, sum(money)   as sums FROM zhuan_cun WHERE type=1 ${subWhere}  GROUP BY days`
        let p1 = {
                'year': `'%Y'`,
                'month': `'%Y-%m'`,
                'day': `'%Y-%m-%d'`
            } [schType],
            p2 = {
                'year': 'years',
                'month': 'months',
                'day': 'days'
            } [schType];
        return `SELECT DATE_FORMAT(date_sign,${p1}) as ${p2}, sum(money)  as sums ${partSql} ${subWhere}  GROUP BY ${p2}`;
    };

    let prs_jieru = ctx.db.query(createSql('FROM zhuan_cun WHERE type=1'));
    let prs_jiechu = ctx.db.query(createSql('FROM zhuan_cun WHERE type=-1'));
    let prs_huanru = ctx.db.query(createSql('FROM zhuan_cun WHERE type=2'));
    let prs_huanchu = ctx.db.query(createSql('FROM zhuan_cun WHERE type=-2'));
    let prs_syru = ctx.db.query(createSql('FROM zhuan_cun WHERE type=3'));
    let prs_sychu = ctx.db.query(createSql('FROM zhuan_cun WHERE type=-3'));
    let prs_zhichu = ctx.db.query(createSql('FROM in_out WHERE type=0'));
    let prs_shouru = ctx.db.query(createSql('FROM in_out WHERE type=1'));
    let prs_cungen = ctx.db.query(createSql('FROM zhuan_cun WHERE type=0'));
    let prs_zhuancun = ctx.db.query(createSql('FROM zhuan_cun WHERE type=100'));

    let data = await Promise.all([prs_jieru, prs_jiechu, prs_huanru, prs_huanchu, prs_syru, prs_sychu, prs_zhichu, prs_shouru, prs_cungen, prs_zhuancun]);

    /*data=[
        [],
        [ { days: '2017-08-01', sums: 14500 } ],
        [],
        [],
        [],
        [],
        [
            { days: '2017-08-01', sums: 1247 },
            { days: '2017-08-02', sums: 40 },
            { days: '2017-08-03', sums: 416 },
            { days: '2017-08-04', sums: 82 },
        ],
        [
            { days: '2017-08-01', sums: 36 },
            { days: '2017-08-02', sums: 30 },
            { days: '2017-08-16', sums: 31 },
            { days: '2017-08-17', sums: 37 },
            { days: '2017-08-18', sums: 26 }
        ],
        [ { days: '2017-08-01', sums: 36446 } ],
        [
            { days: '2017-08-09', sums: 2000 },
            { days: '2017-08-15', sums: 2300 },
            { days: '2017-08-17', sums: 2000 }
        ]
    ];*/

    let dateKeys = {},
        loopArr = ['jieru', 'jiechu', 'huanru', 'huanchu', 'shengyi_shouru', 'shengyi_touzi', 'zhichu', 'shouru', 'cungen']; //此处忽略转存，因此列表用不到
    data.forEach((vv, index) => {
        vv.forEach(v => {
            let vD = v[schType + 's'];
            if (!(vD in dateKeys)) dateKeys[vD] = {};
            dateKeys[vD][loopArr[index]] = v.sums;
        });
    });
    /*dateKeys ={
        '2017-08-01': { jiechu: 14500, zhichu: 1247, shouru: 36, cungen: 36446 },
        '2017-08-02': { zhichu: 40, shouru: 30 },
        '2017-08-03': { zhichu: 416 },
        '2017-08-04': { zhichu: 82 },
        '2017-08-05': { zhichu: 348 },
        '2017-08-06': { zhichu: 190 },
        '2017-08-07': { zhichu: 63 },
        '2017-08-08': { zhichu: 87 },
        '2017-08-09': { zhichu: 382, undefined: 2000 },
        '2017-08-10': { zhichu: 50 },
        '2017-08-11': { zhichu: 86 },
        '2017-08-12': { zhichu: 208 },
        '2017-08-13': { zhichu: 3518 },
        '2017-08-14': { zhichu: 35, shouru: 24 },
        '2017-08-15': { zhichu: 639, shouru: 24, undefined: 2300 },
        '2017-08-16': { zhichu: 26, shouru: 31 },
        '2017-08-17': { zhichu: 50, shouru: 37, undefined: 2000 },
        '2017-08-18': { zhichu: 39, shouru: 26 }
    };*/
    let dateKeys2Arr = [];
    for (let i in dateKeys) {
        dateKeys2Arr.push(i);
    } //转为数组是为了prsArr的then时，结果集的顺序与dateKeys中的日期对应正确
    //Promise.all(prsArr) ：根据已查出的各记录的date值再查询截止到该日期的余额
    let prsArr = [];
    for (let i = 0, l = dateKeys2Arr.length; i < l; i++) {
        let dd = {
            'year': '%Y',
            'month': '%Y-%m',
            'day': '%Y-%m-%d'
        } [schType];
        let isOughtNotPay = '';
        if(ctx.session&&ctx.session===1) isOughtNotPay = ' and isOughtNotPay=0';
        
        prsArr.push(ctx.db.query(`
                SELECT 
                    sum(CASE WHEN type=0 THEN money WHEN type=1 THEN money WHEN type=2 THEN money WHEN type=3 THEN money ELSE 0 END) as shouru,
                    sum(CASE                        WHEN type=-1 THEN money WHEN type=-2 THEN money WHEN type=-3 THEN money ELSE 0 END) as zhichu
                FROM zhuan_cun 
                WHERE DATE_FORMAT(date_sign,'${dd}')<='${dateKeys2Arr[i]}' ${isOughtNotPay}
                
                UNION All
                
                select 
                    sum(CASE WHEN type=1 THEN money ELSE 0 END) as shouru, 
                    sum(CASE WHEN type=0 THEN money ELSE 0 END) as zhichu
                from in_out
                WHERE DATE_FORMAT(date_sign,'${dd}')<='${dateKeys2Arr[i]}' ${isOughtNotPay}`
        ));
    }

    let dataYuEs = await Promise.all(prsArr);

    for (let i = 0, l = dateKeys2Arr.length; i < l; i++) {
        dateKeys[dateKeys2Arr[i]].yu_e = dataYuEs[i][0].shouru + dataYuEs[i][1].shouru - dataYuEs[i][0].zhichu - dataYuEs[i][1].zhichu;
    }

    let listArr = []; //{时间 借出 借入 还出 还入 收入 支出 差额 余额 溢值}
    for (let i in dateKeys) {
        listArr.push({
            date: i,
            jiechu: dateKeys[i].jiechu || 0,
            jieru: dateKeys[i].jieru || 0,
            huanchu: dateKeys[i].huanchu || 0,
            huanru: dateKeys[i].huanru || 0,
            shouru: dateKeys[i].shouru || 0,
            zhichu: dateKeys[i].zhichu || 0,
            shengyi_shouru: dateKeys[i].shengyi_shouru || 0,
            shengyi_touzi: dateKeys[i].shengyi_touzi || 0,
            cungen: dateKeys[i].cungen || 0,
            yu_e: dateKeys[i].yu_e || 0,
            z_cha_e: 0,
            cha_e: 0
        });
    }
    let total = { jiechu: 0, jieru: 0, huanchu: 0, huanru: 0, shouru: 0, zhichu: 0, shengyi_shouru: 0, shengyi_touzi: 0, z_cha_e: 0, cha_e: 0, cungen: 0, yu_e: 0 };
    //手动排序
    listArr.sort((s, e) => new Date(e.date) - new Date(s.date));
    //手动分页并计算其它
    let subListArr = listArr.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    subListArr.forEach(v => {
        v.cha_e = v.shouru - v.zhichu;
        v.z_cha_e = v.shouru + v.jieru + v.huanru + v.shengyi_shouru + v.cungen - v.zhichu - v.jiechu - v.huanchu - v.shengyi_touzi;
        total.jiechu += v.jiechu;
        total.jieru += v.jieru;
        total.huanchu += v.huanchu;
        total.huanru += v.huanru;
        total.shouru += v.shouru;
        total.zhichu += v.zhichu;
        total.shengyi_shouru += v.shengyi_shouru;
        total.shengyi_touzi += v.shengyi_touzi;
        total.cha_e += v.cha_e;
        total.z_cha_e += v.z_cha_e;
        total.cungen += v.cungen;
    });
    ctx.type = 'json';
    ctx.body = {
        listArr: subListArr,
        page: {
            totalRecord: listArr.length,
            currentPage: currentPage,
            pageSize: pageSize,
            pageCount: Math.ceil(listArr.length / pageSize)
        },
        total: total
    };

});

//for rest-client: GET http://localhost:8888/api/listStatistics/zhichu/2019 HTTP/1.1
// 首页数据块 支出    // 统计列表弹窗内容获取：支出
router.get('/zhichu/:date', async (ctx,next)=> {

    let date  = ctx.params.date, temlen= date.split('-').length, sch_type='year'; //date:  '2017' || '2017-01' || '2017-11-05'
    if(temlen===2) sch_type = 'month';
    else if(temlen===3) sch_type = 'day';
    let isOughtNotPay = '';
    if(ctx.session&&ctx.session.level===1) isOughtNotPay = ' and isOughtNotPay=0';
    
    let sqlDateFmtStr={year:'%Y',month:'%Y-%m',day:'%Y-%m-%d'}[sch_type];
    let sqlsObj = {
        outType1: `select id,name from outtype1`,
        bank: `select id,name from bank`,
        bankType: `select id,name from bankType`,
        member: `select id,name from member`,
        typeList: `select outtype1Key as id,sum(money) as money from in_out where type=0 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}' group by outtype1Key`,
        typeList_attach: `select sum(CASE WHEN type=3 THEN money ELSE 0 END) as sy_shouru,sum(CASE WHEN type=-3 THEN money ELSE 0 END) as sy_touzi from zhuan_cun where date_format(date_sign,'${sqlDateFmtStr}')='${date}'  ${isOughtNotPay}`,
        bizhongList: `select bankKey,bankTypeKey,memberKey,sum(money) as money from in_out where type=0 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}' group by bankKey,memberKey,bankTypeKey`,
        forMemberList: `select for_from_memberKey,sum(money) as money from in_out where type=0 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}' group by for_from_memberKey`,
        xuniXianjin: `select sum(CASE WHEN bankTypeKey=2 or bankTypeKey=3 or bankTypeKey=4 THEN money ELSE 0 END) as xuni, sum(CASE WHEN bankTypeKey=1 THEN money ELSE 0 END) as xianjin from in_out where type=0 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}'`,
        isOughtNotPay: `select sum(money) as money from in_out where isOughtNotPay=1 and date_format(date_sign,'${sqlDateFmtStr}')='${date}'`
    };

    let outType1_prs = ctx.db.query(sqlsObj.outType1);
    let bank_prs = ctx.db.query(sqlsObj.bank);
    let bankType_prs = ctx.db.query(sqlsObj.bankType);
    let member_prs = ctx.db.query(sqlsObj.member);
    let typeList_prs = ctx.db.query(sqlsObj.typeList);
    let typeList_attach_prs = ctx.db.query(sqlsObj.typeList_attach);
    let bizhongList_prs = ctx.db.query(sqlsObj.bizhongList);
    let forMemberList_prs = ctx.db.query(sqlsObj.forMemberList);
    let xuniXianjin_prs = ctx.db.query(sqlsObj.xuniXianjin);
    let isOughtNotPay_prs = ctx.db.query(sqlsObj.isOughtNotPay);
    let data = await Promise.all([outType1_prs,typeList_prs,typeList_attach_prs,bank_prs,member_prs,bizhongList_prs,bankType_prs,forMemberList_prs,xuniXianjin_prs,isOughtNotPay_prs]);

    let getNameById = (type,id) =>{
        let arrIndex=0, name = '';
        switch (type){
            case 'outtype1': arrIndex=0; break;
            case 'bank': arrIndex=3; break;
            case 'member': arrIndex=4; break;
            case 'banktype': arrIndex=6; break;
        }
        data[arrIndex].forEach(v => { if(v.id==id) name=v.name; });
        return name;
    };
    data[1].forEach(v => v.name = getNameById('outtype1',v.id));
    if(data[2].length && data[2][0].sy_touzi-data[2][0].sy_shouru>0) data[1].push({id:-100,money:data[2][0].sy_touzi-data[2][0].sy_shouru,name:'生意亏损'});
    data[5].forEach(v => {
        v.bankName = getNameById('bank',v.bankKey);
        v.memberName = getNameById('member',v.memberKey);
        v.banktypeName = getNameById('banktype',v.bankTypeKey);
    });
    data[7].forEach(v => v.forMemberName = getNameById('member',v.for_from_memberKey));
    let xuniXianjin = data[8].length ? data[8][0] : {};
    if(xuniXianjin.xuni===null) delete xuniXianjin.xuni;
    if(xuniXianjin.xianjin===null) delete xuniXianjin.xianjin;
    isOughtNotPay = 0;
    if(data[9] && data[9].length && data[9][0].money) isOughtNotPay= data[9][0].money;

    ctx.type = 'json';
    ctx.body = {
        typeList: data[1],
        bizhongList: data[5],
        forMemberList: data[7],
        xuniXianjin: xuniXianjin,
        isOughtNotPay: isOughtNotPay
    };
});
// 首页数据块 收入   // 统计列表弹窗内容获取：收入
router.get('/shouru/:date', async (ctx,next)=> {

    let date  = ctx.params.date, temlen= date.split('-').length, sch_type='year'; //date:  '2017' || '2017-01' || '2017-11-05'
    if(temlen===2) sch_type = 'month';
    else if(temlen===3) sch_type = 'day';
    let isOughtNotPay = '';
    if(ctx.session&&ctx.session===1) isOughtNotPay = ' and isOughtNotPay=0';
    
    let sqlDateFmtStr={year:'%Y',month:'%Y-%m',day:'%Y-%m-%d'}[sch_type];
    let sqlsObj = {
        intype: `select id,name from intype`,
        bank: `select id,name from bank`,
        bankType: `select id,name from bankType`,
        member: `select id,name from member`,
        typeList: `select intypeKey as id,sum(money) as money from in_out where type=1 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}' group by intypeKey`,
        typeList_attach: `select sum(CASE WHEN type=3 THEN money ELSE 0 END) as sy_shouru,sum(CASE WHEN type=-3 THEN money ELSE 0 END) as sy_touzi from zhuan_cun where date_format(date_sign,'${sqlDateFmtStr}')='${date}'  ${isOughtNotPay}`,
        bizhongList: `select bankKey,bankTypeKey,memberKey,sum(money) as money from in_out where type=1 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}' group by bankKey,memberKey,bankTypeKey`,
        xuniXianjin: `select sum(CASE WHEN bankTypeKey=2 or bankTypeKey=3 or bankTypeKey=4 THEN money ELSE 0 END) as xuni, sum(CASE WHEN bankTypeKey=1 THEN money ELSE 0 END) as xianjin from in_out where type=1 ${isOughtNotPay} and date_format(date_sign,'${sqlDateFmtStr}')='${date}'`
    };
    let intype_prs = ctx.db.query(sqlsObj.intype);
    let bank_prs = ctx.db.query(sqlsObj.bank);
    let bankType_prs = ctx.db.query(sqlsObj.bankType);
    let member_prs = ctx.db.query(sqlsObj.member);
    let typeList_prs = ctx.db.query(sqlsObj.typeList);
    let typeList_attach_prs = ctx.db.query(sqlsObj.typeList_attach);
    let bizhongList_prs = ctx.db.query(sqlsObj.bizhongList);
    let xuniXianjin_prs = ctx.db.query(sqlsObj.xuniXianjin);
    let data = await Promise.all([intype_prs,typeList_prs,typeList_attach_prs,bank_prs,member_prs,bizhongList_prs,bankType_prs,xuniXianjin_prs]);
    let getNameById = (type,id) =>{
        let arrIndex=0, name = '';
        switch (type){
            case 'intype': arrIndex=0; break;
            case 'bank': arrIndex=3; break;
            case 'member': arrIndex=4; break;
            case 'banktype': arrIndex=6; break;
        }
        data[arrIndex].forEach(v => { if(v.id==id) name=v.name; });
        return name;
    };
    data[1].forEach(v => v.name = getNameById('intype',v.id));
    if(data[2].length && data[2][0].sy_shouru-data[2][0].sy_touzi>0) data[1].push({id:-100,money:data[2][0].sy_shouru-data[2][0].sy_touzi,name:'生意盈利'});
    data[5].forEach(v => {
        v.bankName = getNameById('bank',v.bankKey);
        v.memberName = getNameById('member',v.memberKey);
        v.banktypeName = getNameById('banktype',v.bankTypeKey);
    });
    data[7].forEach(v => v.forMemberName = getNameById('member',v.memberKey));
    let xuniXianjin = data[7].length ? data[7][0] : {};
    if(xuniXianjin.xuni===null) delete xuniXianjin.xuni;
    if(xuniXianjin.xianjin===null) delete xuniXianjin.xianjin;

    ctx.type = 'json';
    ctx.body = {
        typeList: data[1],
        bizhongList: data[5],
        xuniXianjin: xuniXianjin
    };
});
// 统计列表弹窗内容获取：账户差额
router.get('/z_cha_e/:date', async(ctx,next) => {
    let date  = ctx.params.date, temlen= date.split('-').length, sch_type='year'; //date:  '2017' || '2017-01' || '2017-11-05'
    if(temlen===2) sch_type = 'month';
    else if(temlen===3) sch_type = 'day';
    let isOughtNotPay = '';
    if(ctx.session&&ctx.session.level===1) isOughtNotPay =  ' and isOughtNotPay=0';
    
    let sqlDateFmtStr={year:'%Y',month:'%Y-%m',day:'%Y-%m-%d'}[sch_type];
    let sqlsObj = {
        bank: `select id,name from bank`,
        bankType: `select id,name from bankType`,
        member: `select id,name from member where ifhome=1`,
        shouZhi: `select bankKey,bankTypeKey,memberKey,sum(CASE WHEN type=0 THEN money ELSE 0 END) as zhichu,sum(CASE WHEN type=1 THEN money ELSE 0 END) as shouru from in_out where date_format(date_sign,'${sqlDateFmtStr}')='${date}' ${isOughtNotPay} group by memberKey,bankKey,bankTypeKey`,
        zhuanCun_in: `select bankKey_to,bankTypeKey_to,memberKey_to, 
                sum(CASE WHEN type=0 THEN money ELSE 0 END) as cungen,    sum(CASE WHEN type=2 THEN money ELSE 0 END) as huanru,
                sum(CASE WHEN type=1 THEN money ELSE 0 END) as jieru,     sum(CASE WHEN type=3 THEN money ELSE 0 END) as sy_shouru, 
                sum(CASE WHEN type=100 THEN money ELSE 0 END) as zhuancun_in
                from zhuan_cun where (type=0 or type=1 or type=2 or type=3 or type=100) and date_format(date_sign,'${sqlDateFmtStr}')='${date}'  ${isOughtNotPay} 
                group by memberKey_to,bankKey_to,bankTypeKey_to`,
        zhuanCun_out: `select bankKey_from,bankTypeKey_from,memberKey_from, 
                sum(CASE WHEN type=-2 THEN money ELSE 0 END) as huanchu,   sum(CASE WHEN type=-1 THEN money ELSE 0 END) as jiechu,
                sum(CASE WHEN type=-3 THEN money ELSE 0 END) as sy_touzi,  sum(CASE WHEN type=100 THEN money ELSE 0 END) as zhuancun_out 
                from zhuan_cun where (type=-2 or type=-1 or type=-3 or type=100) and date_format(date_sign,'${sqlDateFmtStr}')='${date}'  ${isOughtNotPay} 
                group by memberKey_from,bankKey_from,bankTypeKey_from`
    };
    let bank_prs = ctx.db.query(sqlsObj.bank);
    let bankType_prs = ctx.db.query(sqlsObj.bankType);
    let member_prs = ctx.db.query(sqlsObj.member);
    let data = await Promise.all([member_prs,bank_prs,bankType_prs]);
    let getNameById = (type,id) =>{
        let arrIndex=0, name = '';
        switch (type){
            case 'bank': arrIndex=1; break;
            case 'member': arrIndex=0; break;
            case 'bankType': arrIndex=2; break;
        }
        data[arrIndex].forEach(v => { if(v.id==id) name=v.name; });
        return name;
    };
    data[0].forEach(v => v.name = getNameById('member',v.id));
    let shouZhi_prs = ctx.db.query(sqlsObj.shouZhi);
    let zhuanCun_in_prs = ctx.db.query(sqlsObj.zhuanCun_in);
    let zhuanCun_out_prs = ctx.db.query(sqlsObj.zhuanCun_out);

    let datas = await Promise.all([shouZhi_prs,zhuanCun_in_prs,zhuanCun_out_prs]);
    let listObj = {};
    let memeberKey_mix = {};
    datas[0].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey);
        v.bankName = getNameById('bank',v.bankKey);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    datas[1].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey_to);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey_to);
        v.bankName = getNameById('bank',v.bankKey_to);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    datas[2].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey_from);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey_from);
        v.bankName = getNameById('bank',v.bankKey_from);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    for(var i in memeberKey_mix){
        let shouZhiArr = datas[0].filter(v => v.memberName==i);
        let zhuanCunRuArr = datas[1].filter(v => v.memberName==i);
        let zhuanCunChuArr = datas[2].filter(v => v.memberName==i);
        let arr = [];
        shouZhiArr.forEach(v =>{
            let shouru = v.shouru, zhichu = v.zhichu, bankTypeName = v.bankTypeName, bankName = v.bankName;
            let huanru = jieru = sy_shouru = zhuancun_in = cungen = 0;
            let huanchu = jiechu = sy_touzi = zhuancun_out = 0;
            zhuanCunRuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == bankTypeName && vv.bankName == bankName){
                    huanru = vv.huanru;
                    jieru = vv.jieru;
                    sy_shouru = vv.sy_shouru;
                    zhuancun_in = vv.zhuancun_in;
                    cungen = vv.cungen;
                    zhuanCunRuArr.splice(ii,1);
                    var index = datas[1].indexOf(vv);
                    datas[1].splice(index,0);
                }
            });
            zhuanCunChuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == v.bankTypeName && vv.bankName == v.bankName){
                    huanchu = vv.huanchu;
                    jiechu = vv.jiechu;
                    sy_touzi = vv.sy_touzi;
                    zhuancun_out = vv.zhuancun_out;
                    zhuanCunChuArr.splice(ii,1);
                    var index = datas[2].indexOf(vv);
                    datas[2].splice(index,0);
                }
            });
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:shouru+cungen+huanru+jieru+sy_shouru+zhuancun_in-zhichu-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        zhuanCunRuArr.forEach(v =>{
            let huanru=v.huanru, jieru=v.jieru, sy_shouru=v.sy_shouru, zhuancun_in=v.zhuancun_in, cungen=v.cungen, bankTypeName=v.bankTypeName, bankName=v.bankName;
            let huanchu = jiechu = sy_touzi = zhuancun_out = 0;
            zhuanCunChuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == bankTypeName && vv.bankName == bankName){
                    huanchu = vv.huanchu;
                    jiechu = vv.jiechu;
                    sy_touzi = vv.sy_touzi;
                    zhuancun_out = vv.zhuancun_out;
                    zhuanCunChuArr.splice(ii,1);
                    var index = datas[2].indexOf(vv);
                    datas[2].splice(index,0);
                }
            });
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:cungen+huanru+jieru+sy_shouru+zhuancun_in-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        zhuanCunChuArr.forEach(v =>{
            let huanchu=v.huanchu, jiechu=v.jiechu, sy_touzi=v.sy_touzi, zhuancun_out=v.zhuancun_out, bankTypeName=v.bankTypeName, bankName=v.bankName;
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        listObj[i] = arr;
    }
    ctx.type = 'json';
    ctx.body =listObj

});
// 统计列表弹窗内容获取：账户余额  // 首页数据块 余额
router.get('/yu_e/:date', async (ctx,next)=> {

    let date  = ctx.params.date, temlen= date.split('-').length, sch_type='year'; //date:  '2017' || '2017-01' || '2017-11-05'
    if(temlen===2) sch_type = 'month';
    else if(temlen===3) sch_type = 'day';
    let isOughtNotPay = '';
    if(ctx.session&&ctx.session.level===1) isOughtNotPay = ' and isOughtNotPay=0';
    
    let sqlDateFmtStr={year:'%Y',month:'%Y-%m',day:'%Y-%m-%d'}[sch_type];
    let sqlsObj = {
        bank: `select id,name from bank`,
        bankType: `select id,name from bankType`,
        member: `select id,name from member where ifhome=1`,
        shouZhi: `select bankKey,bankTypeKey,memberKey,
                sum(CASE WHEN type=0 THEN money ELSE 0 END) as zhichu,
                sum(CASE WHEN type=1 THEN money ELSE 0 END) as shouru 
                from in_out where date_format(date_sign,'${sqlDateFmtStr}')<='${date}'  ${isOughtNotPay}
                group by memberKey,bankKey,bankTypeKey`,
        zhuanCun_in: `select bankKey_to,bankTypeKey_to,memberKey_to, 
                sum(CASE WHEN type=0 THEN money ELSE 0 END) as cungen,   sum(CASE WHEN type=2 THEN money ELSE 0 END) as huanru,
                sum(CASE WHEN type=1 THEN money ELSE 0 END) as jieru,    sum(CASE WHEN type=3 THEN money ELSE 0 END) as sy_shouru, 
                sum(CASE WHEN type=100 THEN money ELSE 0 END) as zhuancun_in
                from zhuan_cun where (type=0 or type=1 or type=2 or type=3 or type=100) and date_format(date_sign,'${sqlDateFmtStr}')<='${date}' ${isOughtNotPay}
                group by memberKey_to,bankKey_to,bankTypeKey_to`,
        zhuanCun_out: `select bankKey_from,bankTypeKey_from,memberKey_from, 
                sum(CASE WHEN type=-2 THEN money ELSE 0 END) as huanchu,    sum(CASE WHEN type=-1 THEN money ELSE 0 END) as jiechu,
                sum(CASE WHEN type=-3 THEN money ELSE 0 END) as sy_touzi,   sum(CASE WHEN type=100 THEN money ELSE 0 END) as zhuancun_out 
                from zhuan_cun where (type=-2 or type=-1 or type=-3 or type=100) and date_format(date_sign,'${sqlDateFmtStr}')<='${date}'  ${isOughtNotPay}
                group by memberKey_from,bankKey_from,bankTypeKey_from`
    };

    let bank_prs = ctx.db.query(sqlsObj.bank);
    let bankType_prs = ctx.db.query(sqlsObj.bankType);
    let member_prs = ctx.db.query(sqlsObj.member);
    let data = await Promise.all([member_prs,bank_prs,bankType_prs]);

    let getNameById = (type,id) =>{
        let arrIndex=0, name = '';
        switch (type){
            case 'bank': arrIndex=1; break;
            case 'member': arrIndex=0; break;
            case 'bankType': arrIndex=2; break;
        }
        data[arrIndex].forEach(v => { if(v.id==id) name=v.name; });
        return name;
    };
    data[0].forEach(v => v.name = getNameById('member',v.id));
    let shouZhi_prs = ctx.db.query(sqlsObj.shouZhi);
    let zhuanCun_in_prs = ctx.db.query(sqlsObj.zhuanCun_in);
    let zhuanCun_out_prs = ctx.db.query(sqlsObj.zhuanCun_out);
    let datas = await Promise.all([shouZhi_prs,zhuanCun_in_prs,zhuanCun_out_prs]);

    let listObj = {};
    let memeberKey_mix = {};
    datas[0].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey);
        v.bankName = getNameById('bank',v.bankKey);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    datas[1].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey_to);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey_to);
        v.bankName = getNameById('bank',v.bankKey_to);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    datas[2].forEach(v =>{
        v.memberName = getNameById('member',v.memberKey_from);
        v.bankTypeName = getNameById('bankType',v.bankTypeKey_from);
        v.bankName = getNameById('bank',v.bankKey_from);
        if(!(v.memberName in memeberKey_mix)) memeberKey_mix[v.memberName] = true;
    });
    for(var i in memeberKey_mix){
        let shouZhiArr = datas[0].filter(v => v.memberName==i);
        let zhuanCunRuArr = datas[1].filter(v => v.memberName==i);
        let zhuanCunChuArr = datas[2].filter(v => v.memberName==i);
        let arr = [];
        shouZhiArr.forEach(v =>{
            let shouru = v.shouru, zhichu = v.zhichu, bankTypeName = v.bankTypeName, bankName = v.bankName;
            let huanru = jieru = sy_shouru = zhuancun_in = cungen = 0;
            let huanchu = jiechu = sy_touzi = zhuancun_out = 0;
            zhuanCunRuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == bankTypeName && vv.bankName == bankName){
                    huanru = vv.huanru;
                    jieru = vv.jieru;
                    sy_shouru = vv.sy_shouru;
                    zhuancun_in = vv.zhuancun_in;
                    cungen = vv.cungen;
                    zhuanCunRuArr.splice(ii,1);
                    var index = datas[1].indexOf(vv);
                    datas[1].splice(index,0);
                }
            });
            zhuanCunChuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == v.bankTypeName && vv.bankName == v.bankName){
                    huanchu = vv.huanchu;
                    jiechu = vv.jiechu;
                    sy_touzi = vv.sy_touzi;
                    zhuancun_out = vv.zhuancun_out;
                    zhuanCunChuArr.splice(ii,1);
                    var index = datas[2].indexOf(vv);
                    datas[2].splice(index,0);
                }
            });
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:shouru+cungen+huanru+jieru+sy_shouru+zhuancun_in-zhichu-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        zhuanCunRuArr.forEach(v =>{
            let huanru=v.huanru, jieru=v.jieru, sy_shouru=v.sy_shouru, zhuancun_in=v.zhuancun_in, cungen=v.cungen, bankTypeName=v.bankTypeName, bankName=v.bankName;
            let huanchu = jiechu = sy_touzi = zhuancun_out = 0;
            zhuanCunChuArr.forEach((vv,ii) =>{
                if(vv.bankTypeName == bankTypeName && vv.bankName == bankName){
                    huanchu = vv.huanchu;
                    jiechu = vv.jiechu;
                    sy_touzi = vv.sy_touzi;
                    zhuancun_out = vv.zhuancun_out;
                    zhuanCunChuArr.splice(ii,1);
                    var index = datas[2].indexOf(vv);
                    datas[2].splice(index,0);
                }
            });
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:cungen+huanru+jieru+sy_shouru+zhuancun_in-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        zhuanCunChuArr.forEach(v =>{
            let huanchu=v.huanchu, jiechu=v.jiechu, sy_touzi=v.sy_touzi, zhuancun_out=v.zhuancun_out, bankTypeName=v.bankTypeName, bankName=v.bankName;
            arr.push({bankTypeName:bankTypeName, bankName:bankName, money:-huanchu-jiechu-sy_touzi-zhuancun_out});
        });
        arr = arr.filter( v => v.money!=0 );
        listObj[i] = arr;
    }

    ctx.type = 'json';
    ctx.body = listObj;
});


module.exports = router;