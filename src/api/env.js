import appenv from './appenv';
const env={
    qas:{
        wood:'http://localhost:3000/',   //木材计算测试地址
    },
    app:{
        wood:'http://219.128.102.101:49393/proxy/ers/',   //木材计算正式地址
    }
}

export default env[appenv];

