# API Keyper

A node.js API proxy that keeps your API keys out of client side code.

## Requirements
* MongoDB

## Setup

`yarn`

`cp .env.sample .env`

`npm start`

The proxy will be available at:

`http://localhost:4444/api/v1`

## Usage

### Create a new client

This POST request should NOT be made from the client side. Use `curl`, `Postman` etc.

`POST /api/v1/client`

* host - the host of the API to be proxied
* origins - array of allowed origins
* query - any custom query parameters to add to the request
* headers - any custom headers to add to the request

#### Example request:

```json
{
	"host": "api.to.be.proxied.com",
	"origins": [
		"http://localhost:8080",
		"https://only-allow-my-site.com"
	],
	"query": {
		"key": "SUPER_SECRET_KEY_HERE"
	},
	"headers": {
		"Authorization": "Bearer SUPER_SECRET_KEY_HERE"
	}
}
```

#### Example response:

SAVE this response somewhere! The client cannot be deleted/updated without the generated `client_secret`.

The `client_id` is what will be used in your client side app.

```json
{
  "client_id": "123456",
  "client_secret": "789012",
  "origins": [
    "http://localhost:8080",
    "https://only-allow-my-site.com"
  ],
  "host": "api.to.be.proxied.com",
  "query": {
    "key": "SUPER_SECRET_KEY_HERE"
  },
  "headers": {
    "Authorization": "Bearer SUPER_SECRET_KEY_HERE"
  },
  "_id": "987612345"
}
```

### Configure the client

* The keyper.js client is an AJAX agnostic XMLHttpRequest interceptor.
* After configuration, any request that matches a specified host will be sent through the Keyper proxy.

Add the keyper.js client to your page:

```html
<script src="keyper.js" charset="utf-8"></script>
```

Create an instance of the client, with your host and client_id specified:

```js
var keyper = new Keyper({
	host: 'http://localhost:4444/api/v1', // (default value) This is the URL of the Keyper proxy
	debug: true, // (Defaults to false) Show logs and error messages. Turn OFF in production.
	hosts: {
			'api.to.be.proxied.com': {
				client_id: '123456'
			}
		}
});
```

Initialize the client (_before_ any AJAX calls):

```js
keyper.initialize();
```

Initializing the client does 2 things:

1. Generates an "instance" token
	* A token that is unique to _this_ client (browser)
2. Creates an XMLHttpRequest interceptor that will proxy any request that match the hosts specified when you created the instance.

```js
// Will be proxied
$.get('https://api.to.be.proxied.com/some/path?this=that')
	.then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});

// Will NOT be proxied:
$.get('https://not.in.the.config.com/some/other/path?this=that')
	.then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
```

### Get instances for a client

A unique instance is created when the Keyper client is initialized. The instance token is stored in localStorage. Request count for each instance is logged to the DB.

`POST /api/v1/client/:id`

* client_secret - the secret generated when the client was first created

#### Example request:

`POST /api/v1/client/123456`

```json
{
	"client_secret": "789012"
}
```

#### Example response:

```json
[
  {
    "_id": "7890",
    "client_id": "123456",
    "request_count": 100,
    "active": true
  },
	{
		"_id": "3847",
		"client_id": "123456",
		"request_count": 999,
		"active": true
	}
]
```

### Delete an instance

If an instance is abusing your API Key, you may want to revoke access.

`DELETE /api/v1/client/:id/instance/:instance_id`

* client_secret - the secret generated when the client was first created

#### Example request:

`DELETE /api/v1/client/123456/instance/3847`

```json
{
	"client_secret": "789012"
}
```

#### Example response:

```json
{
  "message": "Instance deleted."
}
```

After being deleted, any future requests with the given instance token will be denied:

```json
{
	"error": "Keyper Error: No active instances found."
}
```

To re-activate a client instance, you'll need to invalidate the token and re-initialize:

```js
keyper.invalidateToken(); // Refresh the page after invalidating
```

### Ban an IP

If an IP address is abusing your API Key, you may want to ban the IP outright.

`POST /api/v1/client/:id/ban`

* ips - Array of IPs to ban

#### Example request:

`POST /api/v1/client/123456/ban`

```json
{
	"client_secret": "789012",
	"ips": ["127.0.0.1"]
}
```

#### Example response:

```json
{
  "message": "IP(s) banned"
}
```

After being banned, any future requests for an instance token will be denied:

```json
{
	"error": "Keyper Error: ⛔️"
}
```

### Delete a client

This DELETE request should NOT be made from the client side. Use `curl`, `Postman` etc.

`DELETE /api/v1/client/:id`

* client_secret - the secret generated when the client was first created

#### Example request:

`DELETE /api/v1/client/123456`

```json
{
	"client_secret": "789012"
}
```

#### Example response:

```json
{
  "message": "client deleted"
}
```

After a client has been deleted, all attempts to make requests using the deleted client_id will fail.
