// black（黑色） red（红色） green（绿色） yellow（黄色） magenta（品红/洋红/紫红）
// cyan（青色） white（白色） gray（灰色） grey（灰色） blue（蓝色）
const colors = require('colors');
const Koa = require('koa');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const koaBody = require('koa-body');
const registerRouter = require('../routers/routersIndex');
const session = require('koa-session2');
const db = require('../util/db');
const tool = require('../util/tool');
const loginApi = require('./login.api');

const { subforderName, interfacePre, checkPathIsDoPass, port, subsubforderName } = require('./config');


function getPath(ctx){
    let subFdName = !!subforderName ? `${subforderName}/` : '';
    if(ctx && ctx.request.path.includes('/'+subsubforderName)){
        subFdName = `${subFdName}/${subsubforderName}/`.replace('//','/');
    }
    const indexFile_ = `./${subFdName}index.html`;
    const indexPath_ = `/${subFdName}index`;
    const loginPath_ = `/${subFdName}login`;
    return {
        subFdName,
        indexFile_,
        indexPath_,
        loginPath_,
    }
}

const sendFileSync = (file, ctx) => {
    let typeMime;
    let filePath = path.join('./', file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        typeMime = mime.getType(file);
        if (typeMime) {
            ctx.type = typeMime;
            ctx.body = fs.readFileSync(filePath);
        }
    }
    return !!typeMime;
};
const app = new Koa();


/* gzip压缩配置 start */
const compress = require('koa-compress');
app.use(compress({ threshold: 100 * 1024 }));
/* gzip压缩配置 end */

app.context.db = db;
app.context.tool = tool;
app.context.appObj = {};

const CONFIG = {
    key: 'home$',
    maxAge: 1000 * 3600 * 2,
    overwrite: true,
    httpOnly: true,
    // store:     ， // 可以传入一个用于session的外部存储
    signed: true,
    rolling: false,
    renew: false,
};
// required for cookie signature generation
app.keys = ['newest secret key', 'older secret key']; //此处不设置keys，koa-session2会报错

/*
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (ctx.method == 'OPTIONS') {
            ctx.body = 200;
            return;
        }
        await next();
    });
*/
app.use(koaBody());
// 挂载session注册
app.use(session(CONFIG, app));
// 登录接口通行
app.use(loginApi.routes());
app.use(loginApi.allowedMethods());

/* 登录页时：读取index.html发送 */
    // use  子文件夹时： http://10.20.35.3:88/文件夹/login
    // unUse子文件夹时： http://10.20.35.3:88/login
app.use(async (ctx, next) => {
    if (ctx.method.toUpperCase() === 'GET' && ctx.request.path === getPath(ctx).loginPath_ ) {
        if (!sendFileSync(getPath(ctx).indexFile_, ctx)) await next();
    } else await next();
});

/* 非html，非接口路由，非设置的可通过路由的文件读取自身，发送 */
app.use(async (ctx, next) => {
    if (ctx.method.toUpperCase() === 'GET') {
        let typeMime = mime.getType(ctx.request.path);
        if (typeMime && typeMime !== 'text/html') {
            if (!sendFileSync(ctx.path, ctx)) await next();
        } else {
            await next();
        }
    } else {
        await next();
    }
});

// 挂载session条件拦截
app.use(async (ctx, next) => {
    if(!ctx.session.user || !ctx.session.user.name) {
        // 如果是接口路由
        if(ctx.request.path.startsWith(interfacePre)){
            ctx.throw(401);
        }
        // 其它重定向至login
        ctx.redirect(getPath(ctx).loginPath_);
        ctx.status = 301;
    } else {
        await next();
    }
});

/* 访问首页时：读取index.html发送 */
    // use  子文件夹时： http://10.20.35.3:88/文件夹  ,  http://10.20.35.3:88/文件夹/index
    // unUse子文件夹时： http://10.20.35.3:88  ,  http://10.20.35.3:88/index
app.use(async (ctx, next) => {
    if (ctx.method.toUpperCase() === 'GET' && (
        ctx.request.path === `/${subforderName}`||     // subforderName：'fName'||''
        ctx.request.path === (`/${subforderName}/${subsubforderName}/`).replace('//','/') ||
        ctx.request.path === (`/${subforderName}/${subsubforderName}`).replace('//','/') ||
        ctx.request.path === getPath(ctx).indexPath_
    )) {
        if (!sendFileSync(getPath(ctx).indexFile_, ctx)) await next();
    } else await next();
});

/* 配合前后分离，设置一些通过的路由而不404（login已提出置前）：读取index.html发送 */
app.use(async (ctx, next) => {
    if ( ctx.method.toUpperCase() === 'GET' && checkPathIsDoPass(ctx.request.path, ctx.request.path.includes(`/${subsubforderName}/`)) ) {
        if (!sendFileSync(getPath(ctx).indexFile_, ctx)) await next();
    } else {
        await next();
    }
});

/* 挂载api接口路由 */
app.use(registerRouter());

/* 其它: */
app.use(async (ctx, next) => {
    ctx.session.refresh();
    //目前保持其404
    //sendFileSync(getPath(ctx).indexFile_, ctx); //不用此是因为 会将不存在于路由表中的地址渲染为首页，返回200成功状态
    //ctx.redirect(301, './index'); //此处使用redirect有极大问题
    ctx.throw(404);
});

const sub = !!subforderName ? `/${subforderName}` : '';
const uri = `[ `.green + `localhost:${port}${sub}`.white.underline + ` ]`.green;
let env = process.env.NODE_ENV === 'dev' ? '开发' : process.env.myflag === 'prodhot' ? '热-生产' : '生产';
env = ` ${env} `.magenta.underline;
const pt = `[${port}]`.magenta;

app.listen(port, () => console.log(`
${'-------------------------------------'.yellow}
    ${'家庭帐目管理系统已运行于'.red}${env}${'环境，port:'.red}${pt}
    ${'嘎嘎嘎嘎嘎 '.green}${uri}
    ${'小兔子乖乖，把门儿开开，'.cyan}
    ${'快点开开，我要进来...'.gray}
${'====================================='.yellow}
`));