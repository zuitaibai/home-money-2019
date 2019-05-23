//如果html项目是在根文件夹，请设为''
//如果html项目是在子文件夹，请设为文件夹名
let subforderName; // 'apps/somedir/somedir/.../somedir'
// 接口请求地址中是否包含子目录文件夹名
let _ifInterfaceContainSubforderName;

if(process.env.NODE_ENV==='dev'){ // 由package.json script 传入
    subforderName = '';
    _ifInterfaceContainSubforderName = false;
}else if(process.env.NODE_ENV==='prod'){
    subforderName = 'apps';
    _ifInterfaceContainSubforderName = true;
}else{
    subforderName = '';
    _ifInterfaceContainSubforderName = false;
}

//接口请求前缀
// const _apiPre = '';
// const _apiPre = '/api/subapi/ssubapi';
const _apiPre = '/api';

// 注：当接口请求前缀为空，并且接口名字等于doPassPath名字，并且接口为get方法，
// 会先走doPassPath逻辑，以响应index.html来截胡同名接口。

//for SPA front-end as smoe path donot request for a redirect !!! 
const _doPassPaths = [ //可变量统一使用:any代替
    'listPay',
    'listPay/edit/:any',
    'listCome',
    'listCome/edit/:any',
    'addPayCome',
    'listAccounts',
    'listAccounts/edit/:any',
    'addAccounts',
    'listStatistics',
    'cards',
    'db',
    'editType',
    'login'
];

const interfacePre = (() => {
    let subf = subforderName ? `/${subforderName}` : '';
    if (!_ifInterfaceContainSubforderName) subf = '';
    return `${subf}${_apiPre}`;
})();

const _doPassPathsWithPre = (()=>{
    const pre = !!subforderName ? `${subforderName}/` : '';
    return _doPassPaths.map(item => `/${pre}${item}`);
})();

const checkPathIsDoPass = path => {
    return _doPassPathsWithPre.some(item => {
        if (_apiPre !== '' && path.indexOf(`${_apiPre}/`) > -1) return false;
        if (item === path) return true;
        const escaped = item.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
        const reg = new RegExp('^' + escaped.replace(/:any/g, '[^\\/]+') + '$');
        if (reg.test(path)) return true;
        return false;
    });
}

const port = 8888;

module.exports = {
    subforderName,
    interfacePre,
    checkPathIsDoPass,
    port,
};