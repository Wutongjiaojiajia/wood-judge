import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css';
import '@/style/index.less';
import router from './router'
import store from './store'

Vue.config.productionTip = true;
Vue.use(Vant);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
