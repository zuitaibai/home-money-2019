let tool = {
    objItem2num: (obj,arr) => {
        arr.forEach((v)=>{
            if(v.indexOf('!!:')>-1){
                let arr = v.split('!!:');
                if(arr[0] in obj){
                    if(obj[arr[0]] !== arr[1]) obj[arr[0]] = +obj[arr[0]];
                }
            }else{
                if(v in obj) obj[v] = +obj[v];
            }

        });
        return obj;
    },
    dateFmt: (date=Date.now(),fmt='yyyy-MM-dd') => {
        var now = new Date(date), o = {
            "M+": now.getMonth() + 1, //月份
            "d+": now.getDate(), //日
            "h+": now.getHours(), //小时
            "m+": now.getMinutes(), //分
            "s+": now.getSeconds(), //秒
            "q+": Math.floor((now.getMonth() + 3) / 3), //季度
            "S":  now.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    objDateItemFmt: (obj,option)=>{ //for arr or object
        //tool.objDateItemFmt(obj2,{'date_sign':'yyyy-MM-dd','date_dbCreate':'yyyy-MM-dd hh:mm:ss'})
        if(typeof obj!=='object') return null;
        if(Array.isArray(obj)){ //array
            obj.forEach((v)=>{
                for(var i in option){
                    if(i in v) v[i] = tool.dateFmt(v[i],option[i]);
                }
            });
        }else{ //{ ... }
            for(var i in option){
                if(i in obj){
                    obj[i] = tool.dateFmt(obj[i],option[i]);
                }
            }
        }
        return obj;
    }
};
module.exports = tool;