<template>
  <Login v-if="!user"/>
  <div v-else class="page">
    <div class="usernameQuery">
      <h2>Your Listings</h2>
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
          <div class="shortFormBox">
            <div class="formRow">
              <h2>Apartment Name</h2>
              <input type="text" v-model="apartmentName" value="item.apartmentName" />
            </div>
            <div class="formRow">
              <h2>Price Per Month</h2>
              <input type="text" v-model="price" value="item.price" />
            </div>
          </div>
          <div class="formRow">
            <h2>Address</h2>
            <input type="text" v-model="address" value="item.address" />
          </div>
          <div class="formRow">
            <h2>Description</h2>
            <textarea type="text" v-model="description" value="item.description" />
          </div>
          <div class="formRow">
            <button class="addButton" @click="editListing(item, index)">Update Listing</button>
          </div>
        </form>
      </div>
    </div>
    <div class="user-footer">
      <p class="user-name">{{user.firstName}} {{user.lastName}}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import Login from '@/components/Login.vue';
export default {
  name: "Profile",
  components: {
    Login,
  },
  data() {
    return {
      name: "",
      listings: [],
      isEditing: [],
      apartmentName: "",
      address: "",
      price: "",
      description: "",
    }
  },
  methods: {
    async viewListings() {
      try {
        const response = await axios.get(`/api/user/${this.$root.$data.user.username}/listings`);
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
        await axios.delete(`/api/user/${this.user.username}/listings/${id}`);
        this.viewListings();
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
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
    this.viewListings();
  },
  computed: {
    user() {
      if (this.$root.$data.user != null) {
        this.viewListings();
        return this.$root.$data.user;
      }
      else {
        return null;
      }
    }
  }
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
  border-radius: 50px;
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
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  height: auto;
}

.formRow {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-bottom: 10px;
  margin-left: 5%;
  margin-right: 5%;
}

.formRow textarea,
.formRow input {
  border-radius: 20px;
  border: none;
  padding: 10px;
  font-size: 16pt;
}

.formRow textArea {
  height: 150px;
}

.shortFormBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.addButton {
  align-self: flex-end;
}

.editForm {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  width: 100%;
}

</style>
