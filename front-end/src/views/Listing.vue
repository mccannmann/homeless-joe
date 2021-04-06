<template>
  <div class="listing">
    <div class="info">
      <div class="coloredInfo">
        <h2><strong>Listing Name: </strong>{{ listingItem.apartmentName }}</h2>
        <hr>
        <h2><strong>Price: </strong>{{ listingItem.price }}</h2>
        <hr>
        <h2><strong>Address: </strong>{{ listingItem.address }}</h2>
      </div>
      <h3><strong>Description: </strong>{{ listingItem.description }}</h3>
    </div>
  </div>

</template>

<script>
//import axios from "axios";
import axios from "axios";
export default {
  name: 'Listing',
  data() {
    return {
      listingItem: {}
    }
  },
  computed: {
    listings() {
      this.populateArray();
      return this.listingsArray.filter(listing => listing.apartmentName.toLowerCase().search(this.searchText.toLowerCase()) >= 0);
    }
  },
  methods: {
    async populateListing() {
      try {
        let result = await axios.get(`/api/listings/${this.$route.params.id}`);
        this.listingItem = result.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.populateListing();
  }
}
</script>

<style>

.coloredInfo {
  background-color: #c1fdd8;
  margin-bottom: 20px;
  padding: 10px;
}

.coloredInfo p {
  font-family: serif;
}

.coloredInfo h2 {
  font-weight: normal;
}

hr {
  color: #1F8A8B;
  width: 40%;
  border: 2px solid;
}

</style>
