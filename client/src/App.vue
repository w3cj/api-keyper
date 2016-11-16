<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper">
        <a href="#" class="brand-logo center">API Keyper</a>
        <ul class="left">
          <li><router-link :to="{ name: 'home' }"><i class="material-icons">home</i></router-link></li>
          <li><router-link :to="{ name: 'dashboard' }" v-if="isLoggedIn"><i class="material-icons">view_list</i></router-link></li>
          <li><router-link :to="{ name: 'create' }" v-if="isLoggedIn"><i class="material-icons">create</i></router-link></li>
        </ul>
      </div>
    </nav>
    <main class="container" style="display:flex;">
      <router-view class="view"></router-view>
    </main>
    <footer class="page-footer">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">API Keyper</h5>
            <p class="grey-text text-lighten-4">A node.js API proxy that keeps your API keys out of client side code.</p>
          </div>
          <div class="col l4 offset-l2 s12">
            <ul>
              <li><a class="grey-text text-lighten-3" href="https://github.com/w3cj/api-keyper">API Keyper on Github</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="container">
        © 2016 Made with ❤️ by w3cj
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Auth from './services/Auth';

export default {
  name: 'app',
  data() {
    return {
      isLoggedIn: Auth.isLoggedIn(),
    };
  },
};
</script>

<style>
  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  main {
    flex: 1 0 auto;
  }
</style>
