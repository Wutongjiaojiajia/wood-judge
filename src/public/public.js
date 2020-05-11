

class Public{
    constructor(){}

    // 随机字符串
    randomStr(){
        return Math.random().toString(36).substr(2)
    }

    // 存入本地存储
    saveStorage(key,obj){
        key = key ? key : 'default';
        localStorage[key] = JSON.stringify(obj)
    }

    // 取出本地存储
    getStorage(key){
       key = key ? key : 'default';
       return localStorage[key]?
                JSON.parse(localStorage[key]):{list:[]}
    }

    //移除本地存储
    removeStorage(key) {
        key = key ? key : 'default';
        return localStorage.removeItem(key);
    }

    //数组/对象深拷贝
    deepCopy(data){
        return JSON.parse(JSON.stringify(data));
    }

        
}

export default  new Public()