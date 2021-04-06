<template>
  <div id="app">
    <div id="nav">
      <div class="navImg">
        <img src="../public/logo.png">
      </div>
      <router-link to="/">Home</router-link> |
      <router-link to="/add">Add</router-link> |
      <router-link to="/search">Search</router-link>
    </div>
    <router-view />
    <footer class="footer">
      <p class="footer-partner-name">Mitchell McCann and Jarod Thorley</p>
      <a class="footer-link" href="https://github.com/mccannmann/homeless-joe" target="_blank">Github</a>
    </footer>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E6FFEE;
  padding-bottom: 2.5em;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  font-size: 16pt;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.navImg {
  width: 100%;
}

.footer-link {
  color: black;
  text-decoration: none;
  padding-right: 30px
}

.footer-link:hover {
  color: #bbbbbb;
  text-decoration: none;
}

.footer-link:active {
  color: #dddddd;
  text-decoration: none;
}

.footer {
  position: fixed;
  bottom: 0;
  background-color: #1F8A8B !important;
  width: 100%;
  height: 2.5rem;            /* Footer height */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-partner-name {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 20px;
  margin-right: 0;
}
</style>
