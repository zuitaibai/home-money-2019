const Router = require('koa-router');
const crypto = require('crypto');
const Base64 = require('../util/base64');
const { interfacePre } = require('./config');
const router = new Router({ prefix: `${interfacePre}/login` });

function random(lenRdm, len, maxLenIfLenRdm, ifOnlyNum){
    var str = '',
        range = len,
        arr = ifOnlyNum 
            ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] 
            : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
    
    if(lenRdm){// 位数随机，在len与maxLenIfLenRdm之间
        range = Math.round(Math.random() * (maxLenIfLenRdm-len)) + len;
    }
    for(var i=0; i<range; i++){ //位数固定，此时后两参数可以不传
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

let ran = '';
let getRandom = ()=> random(true,2,4,true);

//for rest-client: GET http://localhost:8888/api/login/getVerCode HTTP/1.1
//获取验证码
router.get('/getVerCode',async (ctx, next) => {
    ran = getRandom();
    ctx.type = 'json';
    ctx.body = {code: ran };
});
//登录
router.post('/', async (ctx, next) => {
    let resp = {code:'no', err:'错误'};
    let body = ctx.request.body;
    if(!body.username || !body.userpwd || !body.usercode) {
        resp = {code:'no', err:'不能为空'};
    } else if(body.usercode!==ran) {
        resp = {code:'no', err:'验证码不正确', ran: ran=getRandom()};
    } else {
        let data = await ctx.db.query(`select * from user where name='${body.username}'`);
        if(data && data.length!==0){
            /*密码生成 ==================================================*/
            /*let randomWord = random(false,8);
            let base64 = new Base64();
            let base64Random = base64.encode(randomWord);
            let password = 密码;
            let newPas = base64Random + password;
            let md5 = crypto.createHash("md5");
            let md5Pas = md5.update(newPas).digest("hex");
            let base64Md5 = base64.encode(md5Pas);
            let lastPassword = base64Random + base64Md5;*/
            /*===========================================================*/
            let base64Random = data[0].password.substring(0,12);
            let newPas = base64Random + body.userpwd;
            let md5 = crypto.createHash("md5");
            let md5Pas = md5.update(newPas).digest("hex");
            let base64 = new Base64();
            let base64Md5 = base64.encode(md5Pas);
            let lastPassword = base64Random + base64Md5;
            if(data[0].password === lastPassword){
                ctx.session.user = data[0];
                ctx.session.level = data[0].level;
                resp = {code:'ok',err:'登录成功'};
            }else{
                resp = {code:'no',err:'密码不对'};
            }
        }else resp = {code:'no', err:'没有此用户'};
    }
    ctx.type = 'json';
    ctx.body = resp;
});
//退出登录
router.get('/loginOut',async (ctx, next) => {
    ctx.session = {};
    ctx.type = 'json';
    ctx.body = {code: 'ok' };
});
//获取当前登录状态：是否登录
router.get('/checkLogin', async (ctx, next) => {
    let ifs = !!(ctx.session && ctx.session.user);
    ctx.type = 'json';
    ctx.body = { login: ifs };
});


module.exports = router;