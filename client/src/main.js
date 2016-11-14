import 'materialize-themes/dist/css/materialize-indigo-pink.css';
import 'materialize-css/dist/js/materialize';

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import Home from './components/Home';
import Create from './components/Create';
import Client from './components/Client';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
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
