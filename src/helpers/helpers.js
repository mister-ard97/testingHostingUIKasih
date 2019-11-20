export function dateCheck(first, second) {
    if(new Date(first) >= new Date(second)){
        return true;
    }else {
        return false
    }

}

export function isDataValid(obj) {
    for(var i = 0; i<Object.keys(obj).length ; i++){
        if(!obj[Object.keys(obj)[i]]){
            console.log(`value of ${Object.keys(obj)[i]} is ${obj[Object.keys(obj)[i]]}`)
            console.log('Data Invalid : ' + Object.keys(obj)[i] + ' is  UNDEFINED!!')
            return false
        }
    }
    console.log('Data is Valid')
    return true
}

export function dateDiff(first, second){
    let date1 = new Date(first); 
    let date2 = second ? new Date(second) : new Date(Date.now());
    if(((date2.getTime() - date1.getTime()) /  (1000 * 60 * 60 * 24)) < 1){
        if(((date2.getTime() - date1.getTime()) /  (1000 * 60 * 60 )) < 1){
            if(((date2.getTime() - date1.getTime()) /  (1000 * 60  )) < 1){
                console.log(((date2.getTime() - date1.getTime()) /  (1000 * 60 * 60 )))
                console.log('masuk')
                return 'Just Now'
            }
            console.log('masuk menit')
            return Math.floor((date2.getTime() - date1.getTime()) /  (1000 * 60 )) + ' Menit yang lalu';
        }
        return Math.floor((date2.getTime() - date1.getTime()) /  (1000 * 60 * 60)) + ' Jam yang lalu';
        // return ' Hari Ini '
    }
    return  Math.floor((date2.getTime() - date1.getTime()) /  (1000 * 60 * 60 * 24)) + ' Hari yang lalu'; 
      
}


  
// export function minus(a, b) {
//     return a - b;
// }

