import Vue from 'vue';
import { Dialog , Notify } from 'vant';
Vue.use(Dialog);
Vue.use(Notify);

//成功提示
const successTip = (message) => {
    Notify({
        message:message,
        duration:3000,
        background:'#1989FA'
    })
}

//失败提示
const failTip = (message) => {
    Notify({
        message:message,
        duration:3000,
        background:'#FF4444'
    })
}

// 校验金额正则表达式
const validateCorrectMoney = (num) => {
    let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    return reg.test(num);
}

export default {
    successTip,
    failTip,
    validateCorrectMoney
}