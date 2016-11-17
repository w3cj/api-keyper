import 'whatwg-fetch';

function API() {
  /* eslint-disable no-undef */
  const apiHost = window.location.host.includes('localhost')
    ? 'http://localhost:4444/api/v1/' : 'https://api-keyper.gteach.xyz/api/v1/';

  function getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.token}`,
      'Content-Type': 'application/json',
    };
  }

  function getJSON(endpoint) {
    return fetch(`${apiHost}${endpoint}`, {
      headers: getHeaders(),
    }).then(response => response.json());
  }

  function postJSON(endpoint, body) {
    return fetch(`${apiHost}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: getHeaders(),
    }).then(response => response.json());
  }

  return {
    getClients() {
      return getJSON('client');
    },
    getClient(id) {
      return getJSON(`client/${id}`);
    },
    getInstances(id) {
      return getJSON(`client/${id}/instances`);
    },
    createClient(client) {
      return postJSON('client', client);
    },
  };
}

export default new API();
