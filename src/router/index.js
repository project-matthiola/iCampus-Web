import Vue from 'vue'
import Router from 'vue-router'
import menus from '@/config/menu-config'
import Login from '@/page/Login'
import Register from '@/page/Register'
import Home from '@/page/Home'

Vue.use(Router);

let routes = [
  {
    path: '/',
    name: '',
    component: Home
  },
  {
    path: '/login',
    name: '',
    component: Login
  },
  {
    path: '/register',
    name: '',
    component: Register
  }
];


menus.forEach((item) => {
  item.sub.forEach((sub) => {
    routes.push({
      path: `/${sub.componentName}`,
      name: sub.componentName,
      component: () => import(`@/page/${sub.componentName}`)
    })
  })
});


export default new Router({ routes })
