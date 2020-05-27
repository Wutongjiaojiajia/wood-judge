import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css';
import '@/style/index.less';
import '@/style/public.less';
import router from './router'
import store from './store'
import utils from '@/public/utils.js';  //引入公共方法
import publicMethods from '@/public/public.js';  //引入公共方法
import IconSvg from '@/components/icon-component';
import api from '@/api';  //api
Vue.component('icon-svg', IconSvg)  //svg组件
Vue.config.productionTip = true;
Vue.use(Vant);
Vue.prototype.$utils = Object.assign(utils,publicMethods); // 将utils引入原型链
Vue.prototype.$http = api;  //将http引入原型链

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
