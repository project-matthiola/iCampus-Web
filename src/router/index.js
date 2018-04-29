import Vue from 'vue'
import Router from 'vue-router'
import menus from '@/config/menu-config'
import Login from '@/page/Login'
import Register from '@/page/Register'
import Home from '@/page/Home'
import addGrade from '@/page/addGrade'
import userSet from '@/page/userSet'

Vue.use(Router);

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    name: 'addGrade',
    //path: '/addGrade/:Cid',
    path: '/addGrade',
    component: addGrade
  },
  {
    path: '/userSet',
    name: 'userSet',
    component: userSet
  }
];


menus.forEach((item) => {
  item.sub.forEach((sub) => {
    routes.push({
      path: `/${sub.componentName}`,
      name: sub.componentName,
      component: () => import(`@/page/${sub.componentName}`),
    })
  })
});


export default new Router({ routes })

