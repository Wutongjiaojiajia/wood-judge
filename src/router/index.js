import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import calculate from '../views/Calculate.vue'
import priceMaintain from '../views/PriceMaintain.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'*',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta:{
      title: '主页'
    }
  },
  {
    path:'/calculate',
    name:'calculate',
    component:calculate,
    meta:{
      title:'木材计算'
    }
  },
  {
    path:'/priceMaintain',
    name:'priceMaintain',
    component:priceMaintain,
    meta:{
      title:'板价维护'
    }
  },
]

const router = new VueRouter({routes})

// 路由切换更改标题
router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router
