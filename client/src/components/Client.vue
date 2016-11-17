<template>
  <div class="container">
    <br><br>
    <h1 class="header center text-wrap"><i class="material-icons host-icon">lock</i>{{this.client.name}}</h1>
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
    <div class="row">
      <h3 class="header center text-wrap"><i class="material-icons host-icon">devices</i>Instances</h3>
      <div v-for="instance in instances" class="col s4 card">
        <h5>{{instance.ip}}</h5>
        <p>
          {{instance.user_agent}}
        </p>
        <a v-on:click="confirmDelete(instance)" class="right"><i class="material-icons">delete_forever</i></a>
      </div>
    </div>
    <div id="deleteModal" class="modal bottom-sheet">
      <div class="modal-content">
        <h4>Modal Header</h4>
        <p>A bunch of text</p>
      </div>
      <div class="modal-footer">
        <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../services/API';

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
      instances: [],
    };
  },
  created() {
    this.getClient();
    this.getInstances();
  },
  mounted() {
    /* eslint-disable */
    $('.collapsible').collapsible();
    $('.modal').modal();
    /* eslint-enable */
  },
  methods: {
    getClient() {
      API
        .getClient(this.$route.params.id)
        .then((client) => {
          this.client = client;
        });
    },
    getInstances() {
      API
        .getInstances(this.$route.params.id)
        .then((instances) => {
          this.instances = instances;
        });
    },
    confirmDelete() {
      /* eslint-disable no-undef */
      $('#deleteModal').modal('open');
      /* eslint-enable no-undef */
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
