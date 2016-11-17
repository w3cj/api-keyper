<template>
  <div class="home">
    <div class="section">
      <div class="container">
        <br><br>
        <h1 class="header center text-wrap"><i class="material-icons host-icon">cloud</i>{{this.client.host}}</h1>
        <ul class="collapsible" data-collapsible="expandable">
          <li>
            <div class="collapsible-header"><i class="material-icons">add_box</i>Add Keyper to your Page</div>
            <div class="collapsible-body">
              <div class="container">
                <pre>&lt;script src="keyper.js"&gt;&lt;/script&gt;</pre>
                <pre>&lt;script&gt;
  var keyper = new Keyper({
      hosts: {
              '{{this.client.host}}': {
                  client_id: '{{this.client.client_id}}'
              }
          }
  });

  // Add this line of code before any AJAX calls that need to be proxied.
  keyper.initialize();
  &lt;/script&gt;
  </pre>
              </div>
            </div>
          </li>
          <li>
            <div class="collapsible-header"><i class="material-icons">perm_identity</i>View Client ID</div>
            <div class="collapsible-body"><p>{{this.client.client_id}}</p></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../services/API';

/* eslint-disable */
$(document).ready(function(){
  $('.collapsible').collapsible();
});
/* eslint-enable */

export default {
  name: 'client',
  data() {
    return {
      client: {
        name: '',
        client_id: '',
        origins: [],
        banned: [],
        host: '',
        query: {},
        _id: '',
      },
    };
  },
  created() {
    this.getClient();
  },
  methods: {
    getClient() {
      API
        .getClient(this.$route.params.id)
        .then((client) => {
          this.client = client;
        });
    },
  },
};
</script>

<style>
  .host-icon {
    display: inline;
    margin-right: 0.5em;
  }
</style>
