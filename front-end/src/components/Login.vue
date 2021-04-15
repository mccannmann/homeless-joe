<template>
<div class="hero">
  <div class="heroBox">
    <form class="pure-form">
      <fieldset>
        <h2>Register for an Account</h2>
        <input class="input" placeholder="first name" v-model="firstName">
        <input class="input" placeholder="last name" v-model="lastName">
      </fieldset>
      <fieldset>
        <input class="input" placeholder="username" v-model="username">
        <input class="input" type="password" placeholder="password" v-model="password">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
    <form class="pure-form space-above">
      <fieldset>
        <h2>Login</h2>
        <input class="input" placeholder="username" v-model="usernameLogin">
        <input class="input" type="password" placeholder="password" v-model="passwordLogin">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="errorLogin" class="error">{{errorLogin}}</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/user/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/user/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style>
.input {
  width: 15%;
  margin: 2.5px;
  border: none !important;
  border-radius: 20px !important;
}
button {
  border-radius: 20px !important;
  background-color: #58CBD8 !important;
}

hr {
  width: 30% !important;
}
</style>
