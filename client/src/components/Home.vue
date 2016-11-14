<template>
  <div class="home">
    <div class="section">
      <div class="container">
        <br><br>
        <h1 class="header center">Keep your API keys a secret!</h1>
        <div class="row center">
          <router-link :to="{ name: 'create' }" class="btn-large waves-effect waves-light">Create a Keyper Client</router-link>
        </div>
        <br><br>
        <div class="row">
          <div class="col s12 m4">
            <div class="icon-block">
              <h2 class="center pink-text"><i class="material-icons">security</i></h2>
              <h5 class="center">Keep your API keys secure</h5>
              <p class="light">Storing API keys in client side code is never a good idea. The only way to keep them safe and secure is by routing API requests through a server, where the keys can remain a secret.</p>
            </div>
          </div>

          <div class="col s12 m4">
            <div class="icon-block">
              <h2 class="center pink-text"><i class="material-icons">cloud</i></h2>
              <h5 class="center">No Back-End Needed</h5>
              <p class="light">Keyper handles all of the back-end logic for you, so you can focus on the front-end. Just add keyper.js to your page and you're ready to go!</p>
            </div>
          </div>

          <div class="col s12 m4">
            <div class="icon-block">
              <h2 class="center pink-text"><i class="material-icons">dashboard</i></h2>
              <h5 class="center">You're in complete control</h5>
              <p class="light">Keyper creates an instance for <i>every</i> client that connects to your API. Remove client instances in the Keyper dashboard, or ban IP addresses outright.</p>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>
