import 'materialize-themes/dist/css/materialize-indigo-pink.css';
import 'materialize-css/dist/js/materialize';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookie from 'vue-cookie';

import App from './App';
import Auth from './components/Auth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Create from './components/Create';
import Client from './components/Client';

Vue.use(VueRouter);
Vue.use(VueCookie);

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/auth/login', name: 'login', component: Auth },
    { path: '/auth/callback', name: 'authCallback', component: Auth },
    { path: '/auth/callback/error/:error', name: 'authError', component: Auth },
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/create', name: 'create', component: Create },
    { path: '/client/:id', name: 'client', component: Client },
  ],
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
