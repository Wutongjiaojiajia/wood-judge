import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'

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
  }
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
