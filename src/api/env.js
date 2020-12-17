import appenv from './appenv';
const env={
    dev:{
        wood:'http://localhost:3000/',   //木材计算测试地址
    },
    app:{
        wood:'https://back.wutongjiaojiajia.cn/',   //木材计算正式地址
    }
}

export default env[appenv];

