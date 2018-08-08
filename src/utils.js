// 时间戳转  日期时间
export  let timestampToTimeDate = function(timestamp){
    var date = new Date(timestamp)
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
}

//时间戳转  日期
export let  timestampToDate = function(timestamp){
    let date = new Date(timestamp)
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() <  10 ? '0'+(date.getDate()) : date.getDate() + ' ';
    return Y+M+D;
}

//时间戳转  时间
export let timestampToTime = function(timestamp){
    var date = new Date(timestamp)
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return h+m+s;
}




