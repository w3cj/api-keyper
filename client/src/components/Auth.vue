<template>
  <div class="container center">
    <br><br>
    <div v-if="isCallback">
      <h1 class="header center">Logging in...</h1>
    </div>
    <h1 class="header center" v-if="isLogin || isError">Login</h1>
    <div class="row center">
      <a :href="authURL" v-if="isLogin || isError" class="btn-large waves-effect waves-light green">Login with Github</a>
    </div>
    <div class="row">
      <div class="col s5">

      </div>
      <div v-if="isCallback" class="valign-wrapper">
        <div class="valign preloader-wrapper big active">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import Auth from '../services/Auth';

export default {
  name: 'auth',
  data() {
    return {
      authURL: Auth.authURL,
      isLogin: this.$route.path.includes('login'),
      isCallback: this.$route.path.includes('callback'),
      isError: this.$route.path.includes('error'),
    };
  },
  created() {
    this.login();
  },
  methods: {
    login() {
      const token = this.$cookie.get('api-keyper-token');
      if (token) {
        this.$cookie.delete('api-keyper-token');
        /* eslint-disable */
        localStorage.token = token;
        this.$router.push({ name: 'dashboard' });
      }
    },
  },
};
</script>
