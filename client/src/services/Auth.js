function Auth() {
  let currentUser = null;
  let currentToken;

  this.authPath = 'auth/api-keyper/github';
  /* eslint-disable */
  this.apiHost = window.location.host.includes('localhost')
    ? 'http://localhost:4444/' : 'https://api-keyper.gteach.xyz/';
  this.authURL = this.apiHost + this.authPath;

  this.isLoggedIn = isLoggedIn;
  this.getCurrentUser = getCurrentUser;

  function isLoggedIn() {
    return getCurrentUser() == null ? false : true;
  }

  function getCurrentUser() {
    const localStorageToken = localStorage.getItem('token');
    if (localStorageToken && currentToken != localStorageToken) {
      currentToken = localStorageToken;
      const payload = localStorage.getItem('token').split('.')[1].replace('-', '+').replace('_', '/');
      currentUser = JSON.parse(atob(payload));
      return currentUser;
    } else if (!localStorageToken) {
      return null;
    } else {
      return currentUser;
    }
  }
}

Auth = new Auth();

export default Auth;
