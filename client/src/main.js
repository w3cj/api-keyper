import 'materialize-themes/dist/css/materialize-indigo-pink.css';
import 'materialize-css/dist/js/materialize';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookie from 'vue-cookie';

import App from './App';
import AuthComponent from './components/Auth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Create from './components/Create';
import Client from './components/Client';

import Auth from './services/Auth';

Vue.use(VueRouter);
Vue.use(VueCookie);

function requireAuth(to, from, next) {
  if (!Auth.isLoggedIn()) {
    next({
      path: '/auth/login',
    });
  } else {
    next();
  }
}

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/auth/login', name: 'login', component: AuthComponent },
    { path: '/auth/callback', name: 'authCallback', component: AuthComponent },
    { path: '/auth/callback/error/:error', name: 'authError', component: AuthComponent },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, beforeEnter: requireAuth },
    { path: '/create', name: 'create', component: Create, beforeEnter: requireAuth },
    { path: '/client/:id', name: 'client', component: Client, beforeEnter: requireAuth },
    { path: '#/logout',
      name: 'logout',
      beforeEnter(to, from, next) {
        Auth.logOut();
        next('/');
      },
    },
    { path: '*',
      beforeEnter(to, from, next) {
        next('/');
      },
    },
  ],
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
