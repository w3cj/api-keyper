<template>
  <div class="container center">
    <br><br>
    <h1 class="header center">Welcome {{currentUser.first_name}}!</h1>
    <br><br>
  </div>
</template>

<script>
import Auth from '../services/Auth';

export default {
  name: 'dashboard',
  data() {
    return {
      currentUser: {},
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.currentUser = Auth.getCurrentUser();
    },
  },
};
</script>
