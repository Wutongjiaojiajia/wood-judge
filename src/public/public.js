

// 随机字符串
function randomStr(){
    return Math.random().toString(36).substr(2)
}

// 存入本地存储
function saveStorage(key,obj){
    key = key ? key : 'default';
    localStorage[key] = JSON.stringify(obj)
}

// 取出本地存储
function getStorage(key){
    key = key ? key : 'default';
    return localStorage[key]?
            JSON.parse(localStorage[key]):{}
}

//移除本地存储
function removeStorage(key) {
    key = key ? key : 'default';
    return localStorage.removeItem(key);
}

//数组/对象深拷贝
function deepCopy(data){
    return JSON.parse(JSON.stringify(data));
}

export default {
    randomStr,
    saveStorage,
    getStorage,
    removeStorage,
    deepCopy,
}