<template>
  <div class="page">
    <div class="usernameQuery">
      <input type="text" v-model="username" />
      <button @click="viewListings">View Listings</button>
    </div>
    <div class="items" v-for="(item, index) in listings" :key="item.id">
      <div class="item">
        <router-link :to="{ name: 'Listing', params: {id: item._id}}">
          {{ item.apartmentName }}
        </router-link>
        <button @click="toggleEditing(index)">Edit Listing</button>
        <button @click="deleteListing(item._id)">Delete Listing</button>
      </div>
      <div class="formContainer" v-if="isEditing[index]">
        <form class="editForm">
          <div class="editFormItem">
          <h2>Apartment Name</h2>
          <input type="text" v-model="apartmentName" value="item.apartmentName" />
        </div>
        <div class="editFormItem">
          <h2>Price Per Month</h2>
          <input type="text" v-model="price" value="item.price" />
        </div>
        <div class="editFormItem">
          <h2>Address</h2>
          <input type="text" v-model="address" value="item.address" />
        </div>
        <div class="editFormItem">
          <h2>Description</h2>
          <input type="text" v-model="description" value="item.description" />
        </div>
        <div class="editFormItem">
          <button @click="editListing(item, index)">Update Listing</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      username: "",
      name: "",
      listings: [],
      isEditing: [],
      apartmentName: "",
      address: "",
      price: "",
      description: "",
      photoPath: "",
      file: null,
    }
  },
  methods: {
    async viewListings() {
      try {
        const response = await axios.get(`/api/user/${this.username}/listings`);
        this.listings = response.data;
        let array = [];
        for (let i = 0; i < this.listings.length; ++i) {
          array.push(false);
        }
        this.isEditing = array;
      } catch (error) {
        console.log(error);
      }
    },
    toggleEditing(index) {
      if (this.isEditing[index]){
        this.$set(this.isEditing, index, false)
      }
      else {
        this.$set(this.isEditing, index, true)
      }
    },
    async editListing(item, index) {
      try {
        await axios.put(`/api/user/listings/${item._id}`, {
          apartmentName: this.apartmentName,
          address: this.address,
          price: this.price,
          description: this.description,
        });
        this.toggleEditing(index);
        this.viewListings();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteListing(id) {
      try {
        await axios.delete(`/api/user/${this.username}/listings/${id}`);
        this.viewListings();
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
  },
};
</script>

<style>

.items {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.item {
  display: flex;
  justify-content: space-around;
  background-color: #c1fdd8;
  width: 90%;
  padding: 20px;
  margin-top: 25px;
  margin-left: 5%;
  margin-bottom: 25px;
  margin-right: 5%;
}

button,
.item a {
  font-family: "Optima", sans-serif;
  font-weight: bold;
  color: white;
  text-decoration: none;
  padding: 10px;
  border: none;
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
  width: 200px;
}

button {
  background-color: #58E7D8;
}

.item a {
  background-color: #58CBD8;
}

.formContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 70%;
  margin-left: 15%;
  margin-right: 15%;
  height: auto;
}

.editForm {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 60%;
  height: auto;
}

.formContainerItem h2{
  font-size: 16px;
}

.editFormItem{
  width: 50%;
  margin-bottom: 20px;
}

</style>
