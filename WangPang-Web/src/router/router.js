import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { path: '/file', query: { filePath: '/', fileType: 0 } }
    }, {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: { title: '登录 - 实训网盘' },
    }, {
      path: '/register',
      name: 'Register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      meta: { title: '注册 - 实训网盘' },
    }, {
      path: '/file',
      name: 'File',
      component: () => import(/* webpackChunkName: "file" */ '@/views/file/File.vue'),
      meta: {
        requireAuth: true,
        title: '实训网盘',
        content: {
          description: '基于springboot + vue 框架开发的Web文件系统，旨在为用户提供一个简单、方便的文件存储方案'
        }
      }
    }, {
      path: '/500',
      name: 'Error_500',
      component: () => import(/* webpackChunkName: "error_500" */ '@/views/ErrorPage/500.vue'),
      meta: { title: '500 - 实训网盘' },
    }, {
      path: '/401',
      name: 'Error_401',
      component: () => import(/* webpackChunkName: "error_401" */ '@/views/ErrorPage/401.vue'),
      meta: { title: '401 - 实训网盘' },
    }, {
      path: '*',
      name: 'Error_404',
      component: () => import(/* webpackChunkName: "error_404" */ '@/views/ErrorPage/404.vue'),
      meta: { title: '404 - 实训网盘' },
    }
  ]
})
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
