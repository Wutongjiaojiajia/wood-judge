import appenv from './appenv';
const env={
    qas:{
        wood:'http://172.16.100.29:18642/proxy/ers/',   //电子放行条测试环境
    },
    app:{
        wood:'http://219.128.102.101:49393/proxy/ers/',   //电子放行条系统正式环境
    }
}

export default env[appenv];