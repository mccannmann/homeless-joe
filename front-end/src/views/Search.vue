<template>
  <div class="search">
    <h1>This is an search page</h1>
    <div class="searchBox">
      <form class="pure-form">
        <i class="fas fa-search"></i><input v-model="searchText" />
      </form>
    </div>
    <div class="listingContainer" v-for="listing in listings" :key="listing.id">
      <div class="item">
        <router-link :to="{ name: 'Listing', params: {id: listing._id}}">
          {{ listing.apartmentName }}
        </router-link>
      </div>
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
    }
  }
}
</script>

<style>

</style>
