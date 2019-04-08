const Router = require('koa-router');
const fs = require('fs');
var path = require("path");
var exec = require('child_process').exec;
var iconv = require('iconv-lite');
const { interfacePre } = require('../boot/config');

const router = new Router({ prefix: `${interfacePre}/db` });

//for rest-client: GET http://localhost:8888/api/db HTTP/1.1
// db操作：返回读取data_ser文件夹下的文件列表，及data_ser/writeSql.txt的内容mode=？ //  ?:open||close
router.get('/', async (ctx, next) => {
    if (!fs.existsSync('data_ser')) fs.mkdirSync('data_ser');
    let files = fs.readdirSync('data_ser');
    let arr = [];
    arr = files.filter(v=>v.indexOf('.sql')>-1).map(v=>v.replace(/\.sql/g,''));
    (arr.length>1) && arr.sort((v1,v2)=>{
        //S-2017_07_29-15_12_41
        function c(v){
            let s = v.split('_'), s1= s[1].split('-'), s2=s[2].split('-');
            return s1.join('-') + ' '+s2.join(':');
        }
        return new Date(c(v2)) - new Date(c(v1));
    });
    let ifOpen = false;
    if(fs.existsSync(`data_ser/writeSql.txt`)){
        let str = fs.readFileSync('data_ser/writeSql.txt').toString();
        ifOpen = !!(str.indexOf('mode=open')>-1);
    }
    ctx.type = 'json';
    ctx.body = {arr:arr,ifOpen:ifOpen};
});

//for rest-client: GET http://localhost:8888/api/db/startWriteSql/open HTTP/1.1
//for rest-client: GET http://localhost:8888/api/db/startWriteSql/close HTTP/1.1
// db操作：设置data_ser/writeSql.txt的内容mode=？ //  ?:open||close
router.get('/startWriteSql/:ifOpen', async (ctx, next) => {
    let data = { code:0 };
    let str1 = str2 = '', re;
    if(ctx.params.ifOpen == 'open'){
        str1 = 'mode=close';
        str2 = 'mode=open';
        re = true;
    }else{
        str1 = 'mode=open';
        str2 = 'mode=close';
        re = false;
    }
    let ifExists = fs.existsSync(`data_ser/writeSql.txt`);

    if(ifExists){
        let data = fs.readFileSync('data_ser/writeSql.txt', {flag: 'r+', encoding: 'utf8'});
        let str = data.toString().replace(str1,str2);
        fs.writeFileSync('data_ser/writeSql.txt', new Buffer(str), {flag: 'r+'});
    }
    else{
        let fd = fs.openSync(`data_ser/writeSql.txt`, 'a');
        fs.writeSync(fd,str2+'\r\n=======================================\r\n\r\n');
        fs.closeSync(fd);
    }
    ctx.type = 'json';
    ctx.body = {code:1,open:re};

});

// db操作：执行sql
router.post('/runSql', async (ctx, next) => {
    let str = ctx.request.body.postD || '';
    let re = {code: 0};
    if(str){
        str = str.replace(/[\r\n]/g,'');
        let arr = str.split(';');
        let arr2 = arr.map( v => ctx.db.query(v));
        let data = await Promise.all(arr2);
        if(data) {
            re = {code: 1};
        }
    }
    ctx.type = 'json';
    ctx.body = re;
});
// db操作：备份
router.get('/backup', async (ctx, next) => {
    let now = ctx.tool.dateFmt(Date.now(),'yyyy-MM-dd_hh-mm-ss');
    let {host, user, password, database} = ctx.db.dbConfStr;
    let run = () => {
        return new Promise((resolve, reject) => {
            exec( `mysqldump -h${host} -u${user} -p${password} ${database} > data_ser/S_${now}.sql`, { encoding: 'binary' }, function(err,stdout,stderr){
                if(err) {
                    console.log( iconv.decode(stderr, 'GBK'));
                    reject({ code:0, err });
                } else {
                    resolve({code: 1, msg: `S_${now}`});
                }
            });
        })
    };
    let result = await run();
    ctx.type = 'json';
    ctx.body = result;
});
// db操作：删除
router.post('/dels',async (ctx,next) => {
    let re = {code:0, done:[]}, files = [], url = 'data_ser/', scu=[];
    let body = ctx.request.body || {};
    if(body.dels && Array.isArray(body.dels) && body.dels.length && fs.existsSync(url)){
        files = fs.readdirSync(url);
        files.forEach((file,index) => {
            var curPath = path.join(url,file);
            if(fs.statSync(curPath).isDirectory()) { }
            else {
                body.dels.forEach(v=>{
                    if(v+'.sql'===file){
                        fs.unlinkSync(curPath);
                        scu.push(v);
                    }
                });
            }
        });
        if(scu.length) re={code:1, done:scu};
    }
    ctx.type = 'json';
    ctx.body = re;
});
// db操作：还原
router.get('/restore/:date', async (ctx, next) => {
    let dbpath = `data_ser/${ctx.params.date}.sql`
    let ifExists = fs.existsSync(dbpath);
    let re = {code:0, msg:'不存在'};
    if(ifExists){
        let run = () => {
            return new Promise((resolve, reject) => {
                let {host, user, password, database} = ctx.db.dbConfStr;
                exec(`mysql -h${host} -u${user} -p${password} ${database} < ${dbpath}`, { encoding: 'binary' },function(err,stdout,stderr){
                    if(err) {
                        console.log( iconv.decode(stderr, 'GBK'));
                        reject({code: 0, msg: '执行错误', err});
                    } else {
                        resolve({code: 1, msg: 'ok'});
                    }
                });
            });
        };
        re = await run();
    }

    ctx.type = 'json';
    ctx.body = re;
});


module.exports = router;