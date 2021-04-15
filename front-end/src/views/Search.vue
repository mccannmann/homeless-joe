<template>
  <div class="search">
    <h1>Search for Listings</h1>
    <div class="searchBox">
      <form class="pure-form">
        <i class="fas fa-search"></i><input class="input" v-model="searchText" />
      </form>
    </div>
    <div class="listingContainer" v-for="listing in listings" :key="listing.id">
      <div class="item">
        <router-link :to="{ name: 'Listing', params: {id: listing._id}}">
          {{ listing.apartmentName }}
        </router-link>
      </div>
    </div>
    <div class="user-footer" v-if="user">
      <p class="user-name">{{user.firstName}} {{user.lastName}}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Home',
  data() {
    return {
      searchText: '',
      listingsArray: [],
    }
  },
  computed: {
    listings() {
      this.populateArray();
      return this.listingsArray.filter(listing => listing.apartmentName.toLowerCase().search(this.searchText.toLowerCase()) >= 0);
    },
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async populateArray() {
      try {
        let result = await axios.get('/api/listings');
        this.listingsArray = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/logout");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/login');
      this.$root.$data.user = response.data.user;
    } catch(error){
      this.$root.$data.user = null;
    }
  }
}
</script>

<style scoped>
  .input {
    width: 40%;
    border: none !important;
    border-radius: 20px !important;
  }
</style>
