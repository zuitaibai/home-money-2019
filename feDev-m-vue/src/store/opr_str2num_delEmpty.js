export default function opr_str2num_delEmpty(){
    for (const m of Object.keys(this)) {
        if (this[m] === '' || this[m] === null || this[m] === undefined) { delete this[m]; }
        else{
            if(m==='pageSize'||m==='outtype1Key'||m==='outtype2Key'||m==='bankTypeKey'||m==='bankKey'||m==='memberKey'||m==='for_from_memberKey'||m==='intypeKey'){
                this[m] = Number(this[m]);
            }else if(m==='type'){
                if(this[m]!=='all'){ this[m] = Number(this[m]); }
            }
        }
    }
}