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


  
// export function minus(a, b) {
//     return a - b;
// }

