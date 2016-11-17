<template>
  <div class="container">
    <br><br>
    <h1 class="header center">Welcome {{currentUser.first_name}}!</h1>
    <div class="row">
      <div class="col s12 center text-center">
        <router-link :to="{ name: 'create' }" class="btn-large waves-effect waves-light red create-button">Create a Client</router-link>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="collection with-header">
            <li class="collection-header"><h4>Clients</h4></li>
            <router-link :to="{ name: 'client', params: { id: client._id } }" v-for="client in clients" class="collection-item avatar green-text">
              <i class="material-icons circle">lock</i>
              <span class="title">{{client.name}}</spanclass>
              <p><strong>Host:</strong>  {{client.host}}</p>
              <p><strong>Client ID:</strong>  {{client.client_id}}</p>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import Auth from '../services/Auth';
import API from '../services/API';

export default {
  name: 'dashboard',
  data() {
    return {
      clients: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.currentUser = Auth.getCurrentUser();
      this.getClients();
    },
    getClients() {
      API
        .getClients()
        .then((clients) => {
          this.clients = clients;
        });
    },
  },
};
</script>
<style>
  .create-button {
    margin-bottom: 2em;
  }
</style>
