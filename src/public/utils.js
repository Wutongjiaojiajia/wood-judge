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

export default {
    successTip,
    failTip
}