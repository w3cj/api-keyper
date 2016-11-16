<template>
  <div class="create">
    <div class="section no-pad-bot">
      <div class="container">
        <div class="row" v-if="creating">
          <h3 class="header center">Creating...</h3>
          <div class="col s5">
          </div>
          <div class="valign-wrapper">
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
        <div class="row" v-if="!creating">
          <h3 class="header center">Create</h3>
          <form class="col s12">
            <div class="row">
              <div class="col s12">
                <h4>Host</h4>
                <p>
                  Enter the host name of the API to be proxied (without http/https).
                </p>
              </div>
              <div class="input-field col s12">
                <input placeholder="maps.googleapis.com" id="host" type="text" class="validate" required>
                <label for="host">Host</label>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <h4>Allowed Origins</h4>
                <p>
                  Enter the base URL of your client application.
                  <br />
                  Add as many as needed (development, production etc.)
                </p>
              </div>
              <div class="input-field col s9">
                <input v-model="origin" placeholder="http://localhost:8080" id="origin" type="text" class="validate" required>
                <label for="origin">Allowed Origin</label>
              </div>
              <div class="input-field col s3">
                <a v-on:click="addOrigin" class="waves-effect waves-light btn">Add Origin</a>
              </div>
              <div class="col s12" v-if="origins.length > 0">
                <table class="striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Origin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="origin in origins">
                      <td><a v-on:click="removeOrigin(origin)" class="left-margin waves-effect waves-light btn yellow black-text"><i class="material-icons">delete</i></a></td>
                      <td>{{origin}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <h4>Query Parameters</h4>
                <p>
                  Enter key/value pairs for any sensitive query parameters.
                  <br />
                  These parameters will be added to the proxied request.
                </p>
              </div>
              <div class="input-field col s4">
                <input v-model="query_key" placeholder="key" id="query_key" type="text" class="validate">
                <label for="query_key">Key</label>
              </div>
              <div class="input-field col s5">
                <input v-model="query_value" placeholder="SUPER_SECRET_API_KEY" id="query_value" type="text" class="validate">
                <label for="query_value">Value</label>
              </div>
              <div class="input-field col s3">
                <a v-on:click="addQuery" class="waves-effect waves-light btn">Add Query</a>
              </div>
              <div class="col s12" v-if="queries.length > 0">
                <table class="striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Key</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="query in queries">
                      <td><a v-on:click="removeQuery(query)" class="waves-effect waves-light btn yellow black-text"><i class="material-icons">delete</i></a></td>
                      <td>{{query.key}}</td>
                      <td>{{query.value}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <h4>Headers</h4>
                <p>
                  Enter name/value pairs for any sensitive headers.
                  <br />
                  These headers will be added to the proxied request.
                </p>
              </div>
              <div class="input-field col s4">
                <input v-model="header_name" placeholder="Authorization" id="header_name" type="text" class="validate">
                <label for="header_name">Name</label>
              </div>
              <div class="input-field col s5">
                <input v-model="header_value" placeholder="Bearer SUPER_SECRET_TOKEN" id="header_value" type="text" class="validate">
                <label for="header_value">Value</label>
              </div>
              <div class="input-field col s3">
                <a v-on:click="addHeader" class="waves-effect waves-light btn">Add Header</a>
              </div>
              <div class="col s12" v-if="headers.length > 0">
                <table class="striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="header in headers">
                      <td><a v-on:click="removeHeader(header)" class="waves-effect waves-light btn yellow black-text"><i class="material-icons">delete</i></a></td>
                      <td>{{header.name}}</td>
                      <td>{{header.value}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="col s4">
              </div>
              <div class="col s3">
                <a v-on:click="create" class="waves-effect waves-light btn-large text-center green">Create Proxy</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function notBlank(input) {
  return input.trim() !== '';
}

export default {
  name: 'create',
  data() {
    return {
      creating: false,
      host: '',
      query_key: '',
      query_value: '',
      header_name: '',
      header_value: '',
      origins: [],
      headers: [],
      queries: [],
    };
  },
  methods: {
    addHeader() {
      if (notBlank(this.header_value) && notBlank(this.header_name)) {
        this.headers.push({
          name: this.header_name,
          value: this.header_value,
        });
        this.header_name = '';
        this.header_value = '';
      }
    },
    removeHeader(header) {
      const index = this.headers.indexOf(header);
      this.headers.splice(index, 1);
    },
    addQuery() {
      if (notBlank(this.query_value) && notBlank(this.query_key)) {
        this.queries.push({
          key: this.query_key,
          value: this.query_value,
        });
        this.query_key = '';
        this.query_value = '';
      }
    },
    removeQuery(query) {
      const index = this.queries.indexOf(query);
      this.queries.splice(index, 1);
    },
    addOrigin() {
      if (notBlank(this.origin)) {
        this.origins.push(this.origin);
        this.origin = '';
      }
    },
    removeOrigin(origin) {
      const index = this.origins.indexOf(origin);
      this.origins.splice(index, 1);
    },
    create() {
      /* eslint-disable */
      this.creating = true;
      const body = {
        host: this.host,
        origins: this.origins,
      };

      if(this.queries.length > 0) {
        body.query = this.queries.reduce((queries, query) => {
          queries[query.key] = query.value;
          return queries;
        }, {});
      }

      if(this.headers.length > 0) {
        body.headers = this.headers.reduce((headers, header) => {
          headers[header.name] = header.value;
          return headers;
        }, {});
      }

      console.log('body', body);

      fetch('http://localhost:4444/api/v1/client', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json();
      }).then((json) => {
        const keyper_clients = localStorage.keyper_clients ? JSON.parse(localStorage.keyper_clients) : {};
        keyper_clients[json._id] = json;
        localStorage.keyper_clients = JSON.stringify(keyper_clients);

        this.$router.push({ name: 'client', params: { id: json._id }})
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>

<style>
  .left-margin {
    margin-left: 2em;
  }
</style>
