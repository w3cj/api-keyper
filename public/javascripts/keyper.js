function Keyper(config) {
  config.host = config.host || 'http://localhost:4444/api/v1';
  this.config = config;
  this.initialize = initialize;
  this.checkClientToken = checkClientToken;

  var interceptCreated = false;
  function initialize() {
    if(!interceptCreated) createIntercept();

    config.hasToken = localStorage.KEYPER_TOKEN ? true : false;
    if(!config.hasToken) {
      getClientToken()
        .catch(function(res) {
          debugError(res.error);
        });
    } else {
      checkClientToken()
        .catch(function(res) {
          debugError(res.error);
        });
    }
  }

  this.invalidateToken = function() {
    localStorage.removeItem('KEYPER_TOKEN');
  }

  var tokenURL = config.host + '/token';
  var waitingOpen = [];
  var waitingHeader = [];
  var waitingSend = [];

  function checkClientToken() {
    return getJSON(tokenURL + '/check')
      .then(function(result) {
        debug(result.message);
      });
  }

  function getClientToken() {
    return postJSON(tokenURL, config.hosts)
        .then(function(token) {
          debug('setting token');
          localStorage.KEYPER_TOKEN = token.token;
          config.hasToken = true;
          for(var i in waitingOpen) {
            var waiting = waitingOpen[i];
            waiting.xhr.open.apply(waiting.xhr, waiting.args);
          }
          waitingOpen = [];

          for(var i in waitingHeader) {
            var waiting = waitingHeader[i];
            waiting.xhr.setRequestHeader.apply(waiting.xhr, waiting.args);
          }
          waitingHeader = [];

          waitingSend.forEach(function(waiting) {
            waiting.xhr.send.apply(waiting.xhr, waiting.args);
          })
          waitingSend = [];
        });
  }

  function createIntercept() {
    (function(prototypeOpen) {
        debug('creating open intercept');
        XMLHttpRequest.prototype.open = function(method, url) {
          var host = getHost(url);
          this.host = host;
          this.shouldIntercept = config.hosts[host] && url != tokenURL ? true : false;
          this._url = url;
          if(!this.shouldIntercept) {
            prototypeOpen.apply(this, arguments);
          } else if(config.hasToken) {
            debug('opening request', url);
            url = config.host + '/request/' + url;
            prototypeOpen.apply(this, arguments);
            this.setRequestHeader('x-keyper-token', localStorage.KEYPER_TOKEN);
            this.setRequestHeader('x-keyper-origin', window.location.origin);
            this.setRequestHeader('x-keyper-requested-with', 'keyper');
          } else {
            waitingOpen.push({ xhr: this, args: arguments });
          }
        };
    })(XMLHttpRequest.prototype.open);

    (function(prototypeSend) {
        debug('creating send intercept');
        XMLHttpRequest.prototype.send = function() {
          if(!this.shouldIntercept || config.hasToken) {
            prototypeSend.apply(this, arguments);
          } else {
            waitingSend.push({ xhr: this, args: arguments });
          }
        };
    })(XMLHttpRequest.prototype.send);

    (function(prototypeSetRequestHeader) {
        debug('creating header intercept');
        XMLHttpRequest.prototype.setRequestHeader = function() {
          if(!this.shouldIntercept || config.hasToken) {
            prototypeSetRequestHeader.apply(this, arguments);
          } else {
            waitingHeader.push({ xhr: this, args: arguments });
          }
        };
    })(XMLHttpRequest.prototype.setRequestHeader);

    interceptCreated = true;
  }

  function getHost(url) {
    return url
      .match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/i)[4];
  }

  function debug() {
    if(config.debug){
      var args = Array.prototype.slice.call(arguments);
      args.unshift('Keyper:');
      console.log.apply(null, args);
    }
  }

  function debugError() {
    if(config.debug){
      var args = Array.prototype.slice.call(arguments);
      args.unshift('Keyper:');
      console.error.apply(null, args);
    }
  }

  function postJSON(url, data) {
    return new Promise(function(resolve, reject){
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = ajaxReadyStateChange(resolve, reject);
      ajax.open('POST', url);
      ajax.setRequestHeader("Content-type", "application/json");
      ajax.send(JSON.stringify(data));
    });
  }

  function getJSON(url) {
    return new Promise(function(resolve, reject){
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = ajaxReadyStateChange(resolve, reject);
      ajax.open('GET', url);
      ajax.setRequestHeader('x-keyper-token', localStorage.KEYPER_TOKEN);
      ajax.send();
    });
  }

  function ajaxReadyStateChange(resolve, reject) {
    return function() {
      if(this.readyState === 4) {
        var result = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve(result);
        } else {
          reject(result);
        }
      }
    }
  }
}
